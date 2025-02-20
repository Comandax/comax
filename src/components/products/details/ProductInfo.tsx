
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

interface ProductInfoProps {
  product: Product;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductInfo({ product, onToggleStatus }: ProductInfoProps) {
  const handleToggleNew = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_new: !product.isNew })
        .eq('id', product._id);

      if (error) throw error;

      // Force a re-fetch of the products to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error updating product new status:', error);
    }
  };

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
          <Switch
            checked={product.isNew}
            onCheckedChange={handleToggleNew}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Nome</h3>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
    </div>
  );
}
