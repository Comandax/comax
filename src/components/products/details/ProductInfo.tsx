
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductInfo({ product, onToggleStatus }: ProductInfoProps) {
  return (
    <div className="space-y-4 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Referência</h3>
          <p className="text-sm text-muted-foreground">{product.reference}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Status</h3>
          <Switch
            checked={!product.disabled}
            onCheckedChange={(checked) => onToggleStatus(product._id, !checked)}
          />
        </div>

        <div>
          <h3 className="font-semibold">Lançamento</h3>
          <div className="mt-1">
            {product.isNew ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Sim
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Não
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Nome</h3>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
    </div>
  );
}
