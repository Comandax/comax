
import type { Product, ProductFormData } from "@/types/product";

const mockProducts: Product[] = [
  {
    _id: "1",
    reference: "REF001",
    name: "Produto 1",
    sizes: [
      { size: "P", value: 50 },
      { size: "M", value: 55 },
      { size: "G", value: 60 }
    ],
    quantities: [
      { value: 5 },
      { value: 10 },
      { value: 15 }
    ],
    disabled: false,
    companyId: "company1",
    isNew: false,
    outOfStock: false
  },
  {
    _id: "2",
    reference: "REF002",
    name: "Produto 2",
    sizes: [
      { size: "P", value: 45, available: true },
      // Tamanho de entrega futura: mantém o preço, apenas não está disponível agora.
      { size: "M", value: 50, available: false },
      { size: "G", value: 55, available: true }
    ],
    quantities: [
      { value: 5 },
      { value: 10 },
      { value: 15 }
    ],
    disabled: false,
    companyId: "company1",
    isNew: true,
    outOfStock: false
  },
  {
    _id: "3",
    reference: "REF003",
    name: "Produto 3 (somente entrega futura)",
    sizes: [
      { size: "P", value: 70, available: false },
      { size: "M", value: 75, available: false }
    ],
    quantities: [
      { value: 5 },
      { value: 10 }
    ],
    disabled: false,
    companyId: "company1",
    isNew: false,
    outOfStock: false
  }
];

export const fetchProducts = async (companyId: string): Promise<Product[]> => {
  return mockProducts.filter(product => product.companyId === companyId);
};

export const createProduct = async (product: ProductFormData, companyId: string): Promise<Product> => {
  const newProduct: Product = {
    _id: Math.random().toString(36).substr(2, 9),
    ...product,
    disabled: false,
    companyId,
    isNew: product.isNew || false,
    outOfStock: product.outOfStock || false
  };
  
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (productId: string, product: ProductFormData): Promise<Product> => {
  const index = mockProducts.findIndex(p => p._id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }

  const updatedProduct: Product = {
    ...mockProducts[index],
    ...product,
    _id: productId,
    companyId: mockProducts[index].companyId,
    disabled: mockProducts[index].disabled,
    isNew: product.isNew ?? mockProducts[index].isNew,
    outOfStock: product.outOfStock ?? mockProducts[index].outOfStock
  };

  mockProducts[index] = updatedProduct;
  return updatedProduct;
};

export const toggleProductStatus = async (productId: string, disabled: boolean): Promise<Product> => {
  const product = mockProducts.find(p => p._id === productId);
  if (!product) {
    throw new Error('Product not found');
  }

  product.disabled = disabled;
  return product;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const index = mockProducts.findIndex(p => p._id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }

  mockProducts.splice(index, 1);
};
