
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { OrderHeader } from "@/components/order/OrderHeader";
import { ProductList } from "@/components/order/ProductList";
import { fetchProducts } from "@/services/mockProductService";

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { companyId } = useParams<{ companyId?: string }>();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => fetchProducts(companyId),
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
