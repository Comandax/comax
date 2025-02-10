
import type { Product, ProductFormData } from "@/types/product";
import { ProductTable } from "./table/ProductTable";
import { useState } from "react";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => Promise<void>;
  onSubmit?: (data: ProductFormData) => Promise<void>;
  onToggleStatus?: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductList({ products, onEdit, onDelete, onSubmit, onToggleStatus }: ProductListProps) {
  return (
    <ProductTable
      products={products}
      onEdit={onEdit}
      onDelete={onDelete}
      onSubmit={onSubmit}
      onToggleStatus={onToggleStatus}
      onProductClick={() => {}}
    />
  );
}
