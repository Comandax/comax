
export interface OrderItemSize {
  size: string;
  price: number;
  quantity: number;
  subtotal: number;
  /** true = tamanho indisponível no momento do pedido, marcado para entrega futura. */
  futureDelivery?: boolean;
}

export interface OrderItem {
  productId: string;
  reference: string;
  name: string;
  sizes: OrderItemSize[];
}

export interface Order {
  _id: string;
  customerName: string;
  date: string;
  time: string;
  customerPhone: string;
  customerCity: string;
  customerState: string;
  customerZipCode: string;
  items: OrderItem[];
  /** Total dos itens disponíveis. Persistido em orders.total. */
  total: number;
  /** Total dos itens de entrega futura. Derivado dos items, não é coluna no banco. */
  futureTotal?: number;
  companyId: string;
  notes?: string;
}

