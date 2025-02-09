
import type { Product, ProductFormData } from "@/types/product";
import { ProductTable } from "./table/ProductTable";
import { ProductDetailsModal } from "./details/ProductDetailsModal";
import { useState } from "react";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductList({ products, onEdit, onDelete, onSubmit, onToggleStatus }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ProductTable
        products={products}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onToggleStatus={onToggleStatus}
        onProductClick={(product) => {
          setSelectedProduct(product);
          setIsModalOpen(true);
        }}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onToggleStatus={onToggleStatus}
      />
    </>
  );
}
