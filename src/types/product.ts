
export interface ProductSize {
  size: string;
  value: number;
  /** Ausente ou true = disponível. Sempre leia com isSizeAvailable(). */
  available?: boolean;
}

export interface Product {
  _id: string;
  reference: string;
  name: string;
  image?: string;
  sizes: ProductSize[];
  quantities: Array<{
    value: number;
  }>;
  disabled: boolean;
  companyId: string;
  isNew: boolean;
  outOfStock: boolean;
}

export type ProductFormData = {
  _id?: string;
  reference: string;
  name: string;
  image?: string;
  sizes: ProductSize[];
  quantities: Array<{
    value: number;
  }>;
  isNew?: boolean;
  outOfStock?: boolean;
}
