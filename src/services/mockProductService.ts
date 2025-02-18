
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
    isNew: false
  },
  {
    _id: "2",
    reference: "REF002",
    name: "Produto 2",
    sizes: [
      { size: "P", value: 45 },
      { size: "M", value: 50 },
      { size: "G", value: 55 }
    ],
    quantities: [
      { value: 5 },
      { value: 10 },
      { value: 15 }
    ],
    disabled: false,
    companyId: "company1",
    isNew: true
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
    isNew: product.isNew || false
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
    isNew: product.isNew ?? mockProducts[index].isNew
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
