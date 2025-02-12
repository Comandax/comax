
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { OrderItem } from "@/types/order";
import type { Json } from "@/integrations/supabase/types";
import type { ContactFormData } from "@/components/ContactForm";

interface OrderSubmissionParams {
  companyId: string;
  contactData: ContactFormData | null;
  selectedItems: any[];
  orderItems: OrderItem[];
  total: number;
  notes: string;
}

export const useOrderSubmission = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const submitOrder = async ({
    companyId,
    contactData,
    selectedItems,
    orderItems,
    total,
    notes
  }: OrderSubmissionParams) => {
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

      const orderData = {
        company_id: companyId,
        customer_name: contactData.name,
        customer_phone: contactData.whatsapp,
        customer_city: contactData.city,
        customer_zip_code: contactData.zipCode,
        items: orderItems as unknown as Json,
        total,
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

  return { submitOrder };
};
