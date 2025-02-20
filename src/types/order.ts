
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
  notes?: string;
}

export interface OrderWithItems extends Order {
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_state: string;
  customer_zip_code: string;
  company_id: string;
}
