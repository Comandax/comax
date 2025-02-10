
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";

interface ProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
}

export const ProductList = ({ products, onQuantitySelect }: ProductListProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Itens para pedido</h2>
      {products.filter(product => !product.disabled).map((product) => (
        <ProductCard
          key={product._id}
          product={{
            id: product._id,
            name: product.name,
            image: `http://82.180.136.47/pedido/productImages/${product.reference}.jpeg?v=2`,
            ref: product.reference,
            sizes: product.sizes
          }}
          onQuantitySelect={(size, quantity, price) => 
            onQuantitySelect(product._id, size, quantity, price)
          }
        />
      ))}
    </div>
  );
};
