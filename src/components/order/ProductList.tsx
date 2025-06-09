
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { LoadingState } from "@/components/index/LoadingState";

interface ProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { productId: string; size: string } | null;
  isLoading?: boolean;
}

export const ProductList = ({ products, onQuantitySelect, resetItem, isLoading = false }: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  // Filter out disabled products first
  const availableProducts = products.filter(product => !product.disabled);

  if (availableProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
      </div>
    );
  }

  // Sort products: featured (isNew) first, then by reference
  const sortedProducts = [...availableProducts].sort((a, b) => {
    // First, prioritize featured products
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    
    // Then sort by reference
    return a.reference.localeCompare(b.reference);
  });

  const handleQuantitySelect = (size: string, quantity: number, price: number, productId: string) => {
    onQuantitySelect(productId, size, quantity, price);
  };

  return (
    <div className="space-y-8">
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
          <ProductCard
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
