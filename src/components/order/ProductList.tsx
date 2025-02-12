
import type { Product } from "@/types/product";
import { ProductSelectionCard } from "@/components/order/ProductSelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/index/LoadingState";

interface ProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { size: string; productId: string; };
}

export const ProductList = ({ products, onQuantitySelect, resetItem }: ProductListProps) => {
  const getImageUrl = async (reference: string) => {
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(`${reference}.jpeg`);
    return data.publicUrl;
  };

  if (!products.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Itens para pedido</h2>
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Itens para pedido</h2>
      {products.filter(product => !product.disabled).map((product) => (
        <ProductSelectionCard
          key={product._id}
          product={{
            id: product._id,
            name: product.name,
            image: product.image || '',
            ref: product.reference,
            sizes: product.sizes.map(size => ({
              label: size.size,
              price: size.value,
              quantities: [0, ...product.quantities.map(q => q.value)]
            }))
          }}
          onQuantitySelect={(size, quantity, price) => 
            onQuantitySelect(product._id, size, quantity, price)
          }
          resetItem={resetItem && resetItem.productId === product._id ? resetItem : undefined}
        />
      ))}
    </div>
  );
};
