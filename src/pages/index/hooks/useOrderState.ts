
import { useState } from "react";
import type { SelectedItem } from "@/components/index/types";
import type { ContactFormData } from "@/components/ContactForm";

export const useOrderState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const [resetItem, setResetItem] = useState<{ productId: string; size: string } | null>(null);

  const handleQuantitySelect = (productId: string, size: string, quantity: number, price: number) => {
    setSelectedItems(prev => {
      const filtered = prev.filter(item => !(item.productId === productId && item.size === size));
      
      if (quantity > 0) {
        return [...filtered, { productId, size, quantity, price }];
      }
      
      return filtered;
    });
  };

  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Dados de contato recebidos:", data);
    setContactData(data);
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setSelectedItems(prev => 
      prev.filter(item => !(item.productId === productId && item.size === size))
    );
    
    // Notify components to reset the quantity selector
    setResetItem({ productId, size });
    
    // Clear reset state after a short delay
    setTimeout(() => {
      setResetItem(null);
    }, 100);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedItems,
    setSelectedItems,
    contactData,
    setContactData,
    resetItem,
    handleQuantitySelect,
    handleContactSubmit,
    handleRemoveItem
  };
};
