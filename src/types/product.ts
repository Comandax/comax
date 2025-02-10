
export interface Product {
  _id: string;
  reference: string;
  name: string;
  image?: string;
  sizes: Array<{
    size: string;
    value: number;
  }>;
  quantities: number[];
  disabled: boolean;
  companyId: string;
}

export interface ProductFormData {
  reference: string;
  name: string;
  image?: string;
  sizes: Array<{
    size: string;
    value: number;
  }>;
  quantities: number[];
}
