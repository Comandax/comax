
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { OrderItem } from "@/types/order";
import type { Json } from "@/integrations/supabase/types";
import type { ContactFormData } from "@/components/ContactForm";
import type { SelectedItem } from "@/components/index/types";

interface UseOrderSubmissionProps {
  company: any;
  contactData: ContactFormData | null;
  selectedItems: SelectedItem[];
  orderItems: OrderItem[];
  total: number;
  shortName: string | undefined;
  setSelectedItems: (items: SelectedItem[]) => void;
  setContactData: (data: ContactFormData | null) => void;
  setIsModalOpen: (open: boolean) => void;
}

export const useOrderSubmission = ({
  company,
  contactData,
  selectedItems,
  orderItems,
  total,
  shortName,
  setSelectedItems,
  setContactData,
  setIsModalOpen
}: UseOrderSubmissionProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
      
      // Formata a data como YYYY-MM-DD usando métodos locais
      const year = brazilTime.getFullYear();
      const month = String(brazilTime.getMonth() + 1).padStart(2, '0');
      const day = String(brazilTime.getDate()).padStart(2, '0');
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
          customer_state: "",
          customer_zip_code: "",
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

  return { handleSubmitOrder };
};
