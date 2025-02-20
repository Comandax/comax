
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { ContactFormData } from "@/components/ContactForm";
import type { Order, OrderItem } from "@/types/order";

interface OrderSubmissionProps {
  companyId: string;
  items: OrderItem[];
  total: number;
  notes: string;
}

export const useOrderSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitOrder = async (
    contactData: ContactFormData,
    orderData: OrderSubmissionProps
  ) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("orders").insert({
        company_id: orderData.companyId,
        customer_name: contactData.name,
        customer_phone: contactData.whatsapp,
        customer_city: contactData.city,
        customer_state: contactData.state,
        customer_zip_code: contactData.zipCode,
        items: orderData.items,
        total: orderData.total,
        notes: orderData.notes,
      });

      if (error) throw error;

      navigate("/order/success");
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOrder,
    isSubmitting,
  };
};
