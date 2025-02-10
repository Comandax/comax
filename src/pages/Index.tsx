
import { useState, useEffect } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { OrderHeader } from "@/components/order/OrderHeader";
import { ProductList } from "@/components/order/ProductList";
import { fetchProducts } from "@/services/productService";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

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
  const { toast } = useToast();
  const { companyId } = useParams<{ companyId?: string }>();

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      if (companyId) {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (error) {
          console.error('Error fetching company:', error);
          toast({
            title: "Erro ao carregar informações da empresa",
            variant: "destructive",
          });
          return;
        }

        setCompany(data);
      }
    };

    fetchCompany();
  }, [companyId, toast]);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => fetchProducts(companyId || ''),
    enabled: !!companyId
  });

  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Contact form data:", data);
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

  const handleSubmitOrder = () => {
    toast({
      title: "Pedido enviado com sucesso!",
      description: "Entraremos em contato em breve.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-white text-xl">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-white text-xl">
          Erro ao carregar produtos: {error instanceof Error ? error.message : 'Erro desconhecido'}
          <br />
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-primary hover:bg-white/90"
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
          </Card>
        )}
        <OrderHeader />
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
