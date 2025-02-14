
export interface OrderItemSize {
  size: string;
  price: number;
  quantity: number;
  subtotal: number;
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
  total: number;
  companyId: string;
}
