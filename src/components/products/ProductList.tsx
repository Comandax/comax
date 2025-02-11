
import type { Product, ProductFormData } from "@/types/product";
import { ProductTable } from "./table/ProductTable";
import { useState } from "react";
import { ProductDetailsModal } from "./details/ProductDetailsModal";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => Promise<void>;
  onSubmit?: (data: ProductFormData) => Promise<void>;
  onToggleStatus?: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductList({ products, onEdit, onDelete, onSubmit, onToggleStatus }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleToggleStatus = async (productId: string, disabled: boolean) => {
    if (onToggleStatus) {
      await onToggleStatus(productId, disabled);
      
      // Atualiza o estado do produto selecionado após a mudança de status
      if (selectedProduct && selectedProduct._id === productId) {
        setSelectedProduct({
          ...selectedProduct,
          disabled: disabled
        });
      }
    }
  };

  return (
    <>
      <ProductTable
        products={products}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onToggleStatus={handleToggleStatus}
        onProductClick={handleProductClick}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onToggleStatus={handleToggleStatus}
      />
    </>
  );
}
