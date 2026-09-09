
export interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
  /** true = tamanho indisponível, incluído para entrega futura. */
  futureDelivery?: boolean;
}

export interface ResetItem {
  size: string;
  productId: string;
}
