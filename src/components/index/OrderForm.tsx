
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductList } from "@/components/order/ProductList";
import { CompactProductList } from "@/components/order/CompactProductList";
import type { Product } from "@/types/product";
import type { ResetItem } from "./types";

interface OrderFormProps {
  companyId: string;
  displayMode: string;
  products: Product[];
  isLoading?: boolean;
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  onContactSubmit: (data: ContactFormData) => void;
  resetItem?: { productId: string; size: string } | null;
}

export const OrderForm = ({ 
  companyId,
  displayMode,
  products, 
  isLoading = false,
  onQuantitySelect,
  onContactSubmit,
  resetItem
}: OrderFormProps) => {
  return (
    <>
      <ContactForm onSubmit={onContactSubmit} />
      <div className="mt-8">
        {displayMode === 'compact' ? (
          <CompactProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        ) : (
          <ProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
};
