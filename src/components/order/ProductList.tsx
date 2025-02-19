
import type { Product } from "@/types/product";
import { ProductSelectionCard } from "@/components/order/ProductSelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/index/LoadingState";
import { PackageX, Sparkles } from "lucide-react";

interface ProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { size: string; productId: string; };
  isLoading?: boolean;
}

export const ProductList = ({ products, onQuantitySelect, resetItem, isLoading = false }: ProductListProps) => {
  const getImageUrl = async (reference: string) => {
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(`${reference}.jpeg`);
    return data.publicUrl;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-onSurfaceVariant mt-8">Itens para pedido</h2>
        <div className="bg-white/90 rounded-lg p-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  const activeProducts = products
    .filter(product => !product.disabled)
    .sort((a, b) => a.reference.localeCompare(b.reference));

  const newProducts = activeProducts.filter(product => product.isNew);

  if (!products.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-onSurfaceVariant mt-8">Itens para pedido</h2>
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
        <h2 className="text-2xl font-semibold text-onSurfaceVariant mt-8">Itens para pedido</h2>
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
      <h2 className="text-2xl font-semibold text-onSurfaceVariant mt-8">Itens para pedido</h2>

      {newProducts.length > 0 && (
        <div className="space-y-4 rounded-lg p-6 border" style={{ backgroundColor: '#DEE0FF', borderColor: '#4C59F2' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-primary">Lançamento</h3>
          </div>
          <div className="space-y-4">
            {newProducts.map((product) => (
              <ProductSelectionCard
                key={`new-${product._id}`}
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
        </div>
      )}

      <div className="space-y-4">
        {activeProducts
          .filter(product => !product.isNew)
          .map((product) => (
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
    </div>
  );
};
