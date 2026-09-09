import type { OrderItem } from "@/types/order";

/**
 * Separa os itens de um pedido por disponibilidade.
 *
 * Um mesmo produto pode ter tamanhos nos dois grupos, então a separação é por
 * tamanho: o produto aparece nas duas seções quando for o caso.
 *
 * O total de entrega futura é derivado dos próprios itens — `orders.total` guarda
 * apenas o total disponível, sem coluna adicional no banco.
 */
export const splitOrderItems = (items: OrderItem[]) => {
  const pick = (wantFuture: boolean): OrderItem[] =>
    items
      .map(item => ({
        ...item,
        sizes: item.sizes.filter(size => Boolean(size.futureDelivery) === wantFuture)
      }))
      .filter(item => item.sizes.length > 0);

  const sumOf = (list: OrderItem[]) =>
    list.reduce(
      (acc, item) => acc + item.sizes.reduce((sum, size) => sum + size.subtotal, 0),
      0
    );

  const availableItems = pick(false);
  const futureItems = pick(true);

  return {
    availableItems,
    futureItems,
    availableTotal: sumOf(availableItems),
    futureTotal: sumOf(futureItems),
    hasFutureItems: futureItems.length > 0
  };
};
