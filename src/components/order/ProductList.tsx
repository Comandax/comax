
import type { Product } from "@/types/product";
import { ProductSelectionCard } from "@/components/order/ProductSelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/index/LoadingState";
import { PackageX } from "lucide-react";

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

  const activeProducts = products.filter(product => !product.disabled);

  if (!products.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Itens para pedido</h2>
        <div className="bg-white/90 rounded-lg p-8 text-center">
          <PackageX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Nenhum produto disponível
          </h3>
          <p className="text-gray-600">
            No momento não há produtos cadastrados para esta empresa.
          </p>
        </div>
      </div>
    );
  }

  if (!activeProducts.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Itens para pedido</h2>
        <div className="bg-white/90 rounded-lg p-8 text-center">
          <PackageX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Produtos temporariamente indisponíveis
          </h3>
          <p className="text-gray-600">
            No momento todos os produtos estão desativados para pedidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Itens para pedido</h2>
      {activeProducts.map((product) => (
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
