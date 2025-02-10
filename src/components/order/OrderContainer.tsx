
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ProductList } from "@/components/order/ProductList";
import { supabase } from "@/integrations/supabase/client";

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

interface OrderContainerProps {
  companyId: string;
  products: any[];
}

export const OrderContainer = ({ companyId, products }: OrderContainerProps) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        customer_name: contactData.name,
        customer_phone: contactData.whatsapp,
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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

      <FloatingTotal total={calculateTotal()} />
    </div>
  );
};
