
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductList } from "@/components/order/ProductList";
import { OrderNotes } from "@/components/OrderNotes";
import { FloatingTotal } from "@/components/FloatingTotal";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import type { OrderItem } from "@/types/order";
import type { Json } from "@/integrations/supabase/types";

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

interface OrderFormProps {
  companyId: string;
  products: Product[];
}

export const OrderForm = ({ companyId, products }: OrderFormProps) => {
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

  const prepareOrderItems = () => {
    const groupedItems = selectedItems.reduce((acc, item) => {
      const product = products.find(p => p._id === item.productId);
      if (!product) return acc;

      const existingItem = acc.find(i => i.productId === item.productId);
      if (existingItem) {
        existingItem.sizes.push({
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.quantity * item.price
        });
      } else {
        acc.push({
          productId: item.productId,
          reference: product.reference,
          name: product.name,
          sizes: [{
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.quantity * item.price
          }]
        });
      }
      return acc;
    }, [] as OrderItem[]);

    return groupedItems;
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
      const { data: companyData } = await supabase
        .from('companies')
        .select('short_name')
        .eq('id', companyId)
        .single();

      if (!companyData?.short_name) {
        throw new Error('Empresa não encontrada');
      }

      const now = new Date();
      const orderItems = prepareOrderItems();

      const orderData = {
        company_id: companyId,
        customer_name: contactData.name,
        customer_phone: contactData.whatsapp,
        customer_city: contactData.city,
        customer_zip_code: contactData.zipCode,
        items: orderItems as unknown as Json,
        total: calculateTotal(),
        notes: notes || null,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0]
      };

      const { error: insertError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (insertError) {
        throw insertError;
      }

      navigate(`/company/${companyData.short_name}/success`);
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
    <>
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
    </>
  );
};
