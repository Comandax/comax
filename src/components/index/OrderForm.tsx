
import { useState } from "react";
import { ProductList } from "@/components/order/ProductList";
import { ContactForm } from "@/components/ContactForm";
import { OrderNotes } from "@/components/OrderNotes";
import { FloatingTotal } from "@/components/FloatingTotal";
import type { Product } from "@/types/product";
import { useOrderCalculations } from "./hooks/useOrderCalculations";
import { useOrderSubmission } from "./hooks/useOrderSubmission";
import { useQuery } from "@tanstack/react-query";

interface OrderFormProps {
  companyId: string;
  products: Product[];
}

export const OrderForm = ({ companyId, products }: OrderFormProps) => {
  const [selectedItems, setSelectedItems] = useState<Array<{
    productId: string;
    size: string;
    quantity: number;
    price: number;
  }>>([]);
  const [resetItem, setResetItem] = useState<{ size: string; productId: string; } | undefined>();
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const { isLoading } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => [], // Query is already being handled by the parent component
    enabled: false, // We don't want to fetch here
  });

  const { total, formattedTotal } = useOrderCalculations({ selectedItems });
  const { handleSubmitOrder, isSubmitting } = useOrderSubmission({
    companyId,
    selectedItems,
    contactInfo,
    total,
    products,
  });

  const handleQuantitySelect = (
    productId: string,
    size: string,
    quantity: number,
    price: number
  ) => {
    setSelectedItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.productId === productId && item.size === size
      );

      if (existingItemIndex > -1) {
        if (quantity === 0) {
          return prev.filter((_, index) => index !== existingItemIndex);
        }
        return prev.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity, price } : item
        );
      }

      if (quantity === 0) return prev;

      return [...prev, { productId, size, quantity, price }];
    });

    setResetItem(undefined);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setSelectedItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
    setResetItem({ productId, size });
  };

  return (
    <div className="space-y-8">
      <ProductList
        products={products}
        onQuantitySelect={handleQuantitySelect}
        resetItem={resetItem}
        isLoading={isLoading}
      />

      {selectedItems.length > 0 && (
        <>
          <ContactForm
            contactInfo={contactInfo}
            onContactChange={handleContactChange}
          />
          <OrderNotes
            notes={contactInfo.notes}
            onNotesChange={(value) => handleContactChange("notes", value)}
          />
          <FloatingTotal
            total={formattedTotal}
            onSubmit={handleSubmitOrder}
            isSubmitting={isSubmitting}
            selectedItems={selectedItems}
            onRemoveItem={handleRemoveItem}
            products={products}
          />
        </>
      )}
    </div>
  );
};
