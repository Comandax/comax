
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductList } from "@/components/order/ProductList";
import type { Product } from "@/types/product";
import type { ResetItem } from "./types";

interface OrderFormProps {
  companyId: string;
  products: Product[];
  isLoading?: boolean;
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
}

export const OrderForm = ({ 
  companyId, 
  products, 
  isLoading = false,
  onQuantitySelect 
}: OrderFormProps) => {
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const [resetItem, setResetItem] = useState<ResetItem | null>(null);

  const handleContactSubmit = (data: ContactFormData) => {
    setContactData(data);
  };

  return (
    <>
      <ContactForm onSubmit={handleContactSubmit} />
      <ProductList 
        products={products} 
        onQuantitySelect={onQuantitySelect}
        resetItem={resetItem}
        isLoading={isLoading}
      />
    </>
  );
};
