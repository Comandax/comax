
export interface Product {
  _id: string;
  reference: string;
  name: string;
  image?: string;
  sizes: Array<{
    size: string;
    value: number;
  }>;
  quantities: Array<{
    value: number;
  }>;
  disabled: boolean;
  companyId: string;
  isNew: boolean;
}

export type ProductFormData = {
  _id?: string;
  reference: string;
  name: string;
  image?: string;
  sizes: Array<{
    size: string;
    value: number;
  }>;
  quantities: Array<{
    value: number;
  }>;
  isNew?: boolean;
}
