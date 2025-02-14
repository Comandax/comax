
import { useMemo } from "react";
import type { Product } from "@/types/product";
import type { OrderItem } from "@/types/order";

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

export const useOrderCalculations = (selectedItems: SelectedItem[], products: Product[]) => {
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

  const memoizedTotal = useMemo(() => calculateTotal(), [selectedItems]);
  const memoizedOrderItems = useMemo(() => prepareOrderItems(), [selectedItems, products]);

  return {
    total: memoizedTotal,
    orderItems: memoizedOrderItems
  };
};
