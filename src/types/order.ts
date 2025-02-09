
export interface OrderItem {
  _id: string;
  code: string;
  name: string;
  size: string;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  customerName: string;
  date: string;
  time: string;
  customerPhone: string;
  customerCity: string;
  customerZipCode: string;
  items: OrderItem[];
  total: number;
  companyId: string;
}

