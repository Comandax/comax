import { useState, useEffect } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ProductList } from "@/components/order/ProductList";
import { fetchProducts } from "@/services/productService";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const { toast } = useToast();
  const { companyId } = useParams<{ companyId?: string }>();
  const navigate = useNavigate();

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) {
        setIsLoading(false);
        setError("Nenhuma empresa especificada no endereço.");
        return;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        setError("Empresa não encontrada. Por favor, verifique se o endereço está correto.");
        toast({
          title: "Erro ao carregar informações da empresa",
          variant: "destructive",
        });
      } else {
        setCompany(data);
      }
      setIsLoading(false);
    };

    fetchCompany();
  }, [companyId, toast]);

  const { data: products = [] } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => fetchProducts(companyId || ''),
    enabled: !!companyId && !!company
  });

  const handleContactSubmit = (data: ContactFormData) => {
    setContactData(data);
  };

  const handleQuantitySelect = (productId: string, size: string, quantity: number, price: number) => {
    setSelectedItems(prev => {
      const filtered = prev.filter(item => !(item.productId === productId && item.size === size));
      
      if (quantity > 0) {
        return [...filtered, { productId, size, quantity, price }];
      }
      
      return filtered;
    });
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (!companyId) {
      toast({
        title: "Erro ao enviar pedido",
        description: "Empresa não especificada.",
        variant: "destructive",
      });
      return;
    }

    if (!contactData) {
      toast({
        title: "Erro ao enviar pedido",
        description: "Por favor, preencha seus dados de contato.",
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
      const orderData = {
        company_id: companyId,
        customer_name: `${contactData.firstName} ${contactData.lastName}`,
        customer_phone: contactData.phone,
        customer_city: contactData.city,
        customer_zip_code: contactData.zipCode,
        items: selectedItems.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        })),
        total: calculateTotal(),
        notes: notes
      };

      const { error: insertError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (insertError) {
        throw insertError;
      }

      navigate(`/${companyId}/success`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Erro ao enviar pedido",
        description: "Ocorreu um erro ao salvar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-white text-xl mb-6">{error || "Empresa não encontrada"}</p>
          <p className="text-white text-lg mb-8">Por favor, verifique se o endereço está correto.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-white text-primary hover:bg-white/90"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {company && (
          <Card className="p-6 bg-white/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {company.logo_url && (
                  <img 
                    src={company.logo_url} 
                    alt={`${company.name} logo`}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
                </div>
              </div>
              <button
                onClick={() => navigate("/admin")}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Painel Administrativo"
              >
                <Settings2 size={24} />
              </button>
            </div>
          </Card>
        )}
        <ContactForm onSubmit={handleContactSubmit} />
        <ProductList products={products} onQuantitySelect={handleQuantitySelect} />
        <OrderNotes value={notes} onChange={setNotes} />

        <div className="text-center">
          <Button
            onClick={handleSubmitOrder}
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            Enviar pedido
          </Button>
        </div>
      </div>

      <FloatingTotal total={calculateTotal()} />
    </div>
  );
};

export default Index;
