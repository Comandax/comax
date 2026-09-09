
import { useMemo } from "react";
import type { Product } from "@/types/product";
import type { OrderItem } from "@/types/order";
import type { SelectedItem } from "@/components/index/types";

export const useOrderCalculations = (selectedItems: SelectedItem[], products: Product[]) => {
  // Totais separados: o card e o pedido registram apenas os itens disponíveis,
  // enquanto os de entrega futura são somados à parte.
  const { total, futureTotal } = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => {
        const subtotal = item.quantity * item.price;
        if (item.futureDelivery) {
          acc.futureTotal += subtotal;
        } else {
          acc.total += subtotal;
        }
        return acc;
      },
      { total: 0, futureTotal: 0 }
    );
  }, [selectedItems]);

  const orderItems = useMemo(() => {
    return selectedItems.reduce((acc, item) => {
      const product = products.find(p => p._id === item.productId);
      if (!product) return acc;

      const orderItemSize = {
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.quantity * item.price,
        futureDelivery: item.futureDelivery ?? false
      };

      const existingItem = acc.find(i => i.productId === item.productId);
      if (existingItem) {
        existingItem.sizes.push(orderItemSize);
      } else {
        acc.push({
          productId: item.productId,
          reference: product.reference,
          name: product.name,
          sizes: [orderItemSize]
        });
      }
      return acc;
    }, [] as OrderItem[]);
  }, [selectedItems, products]);

  return {
    total,
    futureTotal,
    orderItems
  };
};
