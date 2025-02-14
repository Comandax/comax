
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductList } from "@/components/order/ProductList";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderSummaryButton } from "./OrderSummaryButton";
import { useOrderCalculations } from "./hooks/useOrderCalculations";
import { useOrderSubmission } from "./hooks/useOrderSubmission";
import type { Product } from "@/types/product";
import type { SelectedItem, ResetItem } from "./types";

interface OrderFormProps {
  companyId: string;
  products: Product[];
  isLoading?: boolean;
}

export const OrderForm = ({ companyId, products, isLoading = false }: OrderFormProps) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetItem, setResetItem] = useState<ResetItem | null>(null);

  const { total, orderItems } = useOrderCalculations(selectedItems, products);
  const { submitOrder } = useOrderSubmission();

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

  const handleSubmitOrder = async (notes: string) => {
    await submitOrder({
      companyId,
      contactData,
      selectedItems,
      orderItems,
      total,
      notes
    });
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setResetItem({ productId, size });
    handleQuantitySelect(productId, size, 0, 0);
  };

  return (
    <>
      <ContactForm onSubmit={handleContactSubmit} />
      <ProductList 
        products={products} 
        onQuantitySelect={handleQuantitySelect} 
        resetItem={resetItem}
        isLoading={isLoading}
      />
      
      {selectedItems.length > 0 && (
        <div className="mt-8 flex justify-end">
          <OrderSummaryButton 
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      )}

      <FloatingTotal 
        total={total}
        items={orderItems}
        onSubmitOrder={handleSubmitOrder}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
};
