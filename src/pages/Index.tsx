
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/services/productService";
import { LoadingState } from "@/components/index/LoadingState";
import { NotFoundState } from "@/components/index/NotFoundState";
import { CompanyInfo } from "@/components/index/CompanyInfo";
import { OrderForm } from "@/components/index/OrderForm";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useOrderCalculations } from "@/components/index/hooks/useOrderCalculations";
import type { SelectedItem } from "@/components/index/types";
import type { ContactFormData } from "@/components/ContactForm";
import type { Json } from "@/integrations/supabase/types";

const Index = () => {
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const { toast } = useToast();
  const params = useParams();
  const navigate = useNavigate();
  const shortName = params.shortName;

  useEffect(() => {
    console.log('🔍 Iniciando busca da empresa com shortName:', shortName);
    
    if (!shortName) {
      console.log('❌ shortName não fornecido, redirecionando para login');
      navigate('/login');
      return;
    }

    const fetchCompany = async () => {
      try {
        console.log('📡 Fazendo requisição ao Supabase para shortName:', shortName);
        
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('short_name', shortName)
          .maybeSingle();

        console.log('📦 Resposta do Supabase:', { data, error });

        if (error) {
          throw error;
        }

        if (!data) {
          console.log('⚠️ Nenhuma empresa encontrada para shortName:', shortName);
          setError("Empresa não encontrada. Por favor, verifique se o endereço está correto.");
        } else {
          console.log('✅ Empresa encontrada:', data);
          setCompany(data);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar empresa:', error);
        setError("Erro ao carregar informações da empresa.");
        toast({
          title: "Erro ao carregar informações da empresa",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [shortName, toast, navigate]);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', company?.id],
    queryFn: () => {
      console.log('🔍 Buscando produtos para empresa:', company?.id);
      return fetchProducts(company?.id || '');
    },
    enabled: !!company?.id,
  });

  const { total, orderItems } = useOrderCalculations(selectedItems, products);

  const handleQuantitySelect = (productId: string, size: string, quantity: number, price: number) => {
    setSelectedItems(prev => {
      const filtered = prev.filter(item => !(item.productId === productId && item.size === size));
      
      if (quantity > 0) {
        return [...filtered, { productId, size, quantity, price }];
      }
      
      return filtered;
    });
  };

  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Dados de contato recebidos:", data);
    setContactData(data);
  };

  const handleSubmitOrder = async (notes: string) => {
    console.log("Submetendo pedido com notas:", notes);
    
    if (!contactData) {
      toast({
        title: "Erro ao enviar pedido",
        description: "Por favor, preencha seus dados de contato primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Erro ao enviar pedido",
        description: "Selecione pelo menos um produto.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepara os items como Json compatível com Supabase
      const jsonItems: Json = orderItems.map(item => ({
        productId: item.productId,
        reference: item.reference,
        name: item.name,
        sizes: item.sizes.map(size => ({
          size: size.size,
          price: size.price,
          quantity: size.quantity,
          subtotal: size.subtotal
        }))
      }));

      // Obtém a data e hora no fuso horário de Brasília
      const now = new Date();
      
      // Ajusta para UTC-3 (Brasília)
      const brazilTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
      
      // Formata a data como YYYY-MM-DD
      const year = brazilTime.getUTCFullYear();
      const month = String(brazilTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(brazilTime.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // Formata a hora como HH:mm
      const hours = String(brazilTime.getUTCHours()).padStart(2, '0');
      const minutes = String(brazilTime.getUTCMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      console.log('Data e hora do pedido (Brasília):', { dateStr, timeStr });

      const { error: insertError } = await supabase
        .from('orders')
        .insert({
          company_id: company.id,
          customer_name: contactData.name,
          customer_phone: contactData.whatsapp,
          customer_city: contactData.city,
          customer_state: contactData.state,
          customer_zip_code: contactData.zipCode,
          items: jsonItems,
          total: total,
          notes: notes || null,
          date: dateStr,
          time: timeStr
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Pedido enviado com sucesso!",
        description: "Em breve entraremos em contato.",
      });

      // Limpa o formulário
      setSelectedItems([]);
      setContactData(null);
      setIsModalOpen(false);

      // Redireciona para a página de sucesso
      navigate(`/${shortName}/success`);
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      toast({
        title: "Erro ao enviar pedido",
        description: "Ocorreu um erro ao salvar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setSelectedItems(prev => 
      prev.filter(item => !(item.productId === productId && item.size === size))
    );
  };

  if (isLoading) return <LoadingState />;
  if (error || !company) return <NotFoundState error={error} />;

  return (
    <div className="flex flex-col min-h-screen h-full bg-background">
      <CompanyInfo 
        company={company}
        total={total}
        items={orderItems}
        onSubmitOrder={handleSubmitOrder}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRemoveItem={handleRemoveItem}
        isCalculating={false}
      />
      
      <div className="container mx-auto px-4 py-2 flex-1 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-center text-onSurfaceVariant">
            Simulações e Pedidos
          </h1>

          <Card className="border-border/30 bg-surfaceContainerLowest shadow-lg backdrop-blur-sm p-8">
            <OrderForm 
              companyId={company.id} 
              products={products} 
              isLoading={isLoadingProducts}
              onQuantitySelect={handleQuantitySelect}
              onContactSubmit={handleContactSubmit}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
