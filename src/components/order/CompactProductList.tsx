
import { ProductSelectionCard } from "./ProductSelectionCard";
import type { Product } from "@/types/product";
import { LoadingState } from "@/components/index/LoadingState";

interface CompactProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { productId: string; size: string } | null;
  isLoading?: boolean;
}

export const CompactProductList = ({ products, onQuantitySelect, resetItem, isLoading = false }: CompactProductListProps) => {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
      </div>
    );
  }

  // Sort products to show featured (isNew) products first
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return 0;
  });

  const handleQuantitySelect = (size: string, quantity: number, price: number, productId: string) => {
    onQuantitySelect(productId, size, quantity, price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.map((product) => {
        const productForCard = {
          id: product._id,
          name: product.name,
          image: product.image || "",
          ref: product.reference,
          sizes: product.sizes.map(size => ({
            label: size.size,
            price: size.value,
            quantities: product.quantities.map(q => q.value)
          })),
          outOfStock: product.outOfStock
        };

        return (
          <ProductSelectionCard
            key={product._id}
            product={productForCard}
            onQuantitySelect={(size, quantity, price) => 
              handleQuantitySelect(size, quantity, price, product._id)
            }
            resetItem={resetItem && resetItem.productId === product._id ? 
              { size: resetItem.size, productId: resetItem.productId } : undefined
            }
          />
        );
      })}
    </div>
  );
};
