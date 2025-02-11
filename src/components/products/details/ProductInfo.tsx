
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductInfo({ product, onToggleStatus }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Referência</h3>
        <p className="text-sm text-muted-foreground">{product.reference}</p>
      </div>
      <div>
        <h3 className="font-semibold">Nome</h3>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <div>
        <h3 className="font-semibold">Status</h3>
        <Switch
          checked={!product.disabled}
          onCheckedChange={(checked) => onToggleStatus(product._id, !checked)}
        />
      </div>
    </div>
  );
}
