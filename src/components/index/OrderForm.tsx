
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
}

export const OrderForm = ({ companyId, products }: OrderFormProps) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resetItem, setResetItem] = useState<ResetItem | null>(null);

  const { total, orderItems } = useOrderCalculations(selectedItems, products);
  const { submitOrder } = useOrderSubmission();

  const handleContactSubmit = (data: ContactFormData) => {
    setContactData(data);
  };

  const handleQuantitySelect = (productId: string, size: string, quantity: number, price: number) => {
    // Imediatamente define como calculando
    setIsCalculating(true);
    
    setSelectedItems(prev => {
      const filtered = prev.filter(item => !(item.productId === productId && item.size === size));
      
      if (quantity > 0) {
        return [...filtered, { productId, size, quantity, price }];
      }
      
      return filtered;
    });
    
    // Mantém o estado de calculando por pelo menos 500ms para garantir uma transição suave
    setTimeout(() => {
      setIsCalculating(false);
    }, 500);
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
      />
      
      {selectedItems.length > 0 && (
        <div className="mt-8 flex justify-end">
          <OrderSummaryButton 
            onClick={() => setIsModalOpen(true)}
            isLoading={isCalculating}
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
        isCalculating={isCalculating}
      />
    </>
  );
};
