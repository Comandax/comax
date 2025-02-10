
export interface ProductSize {
  size: string;
  value: number;
}

export interface Product {
  _id: string;
  reference: string;
  name: string;
  image?: string;
  sizes: ProductSize[];
  quantities: number[];
  disabled: boolean;
  companyId: string;
}

export interface ProductFormData {
  reference: string;
  name: string;
  image?: string;
  sizes: ProductSize[];
  quantities: number[];
}

export interface ProductCardSize {
  label: string;
  price: number;
  quantities: number[];
}

