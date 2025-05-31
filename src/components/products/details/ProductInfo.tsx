
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
  onToggleOutOfStock?: (productId: string, outOfStock: boolean) => Promise<void>;
  form?: UseFormReturn<ProductFormData>;
}

export function ProductInfo({ product, onToggleStatus, onToggleOutOfStock, form }: ProductInfoProps) {
  const handleToggleNew = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_new: !product.isNew })
        .eq('id', product._id);

      if (error) throw error;

      // Atualiza o estado do produto no componente pai
      product.isNew = !product.isNew;
      
      toast({
        title: "Produto atualizado",
        description: `O produto ${product.name} foi ${product.isNew ? 'marcado' : 'desmarcado'} como lançamento.`,
      });

    } catch (error) {
      console.error('Error updating product new status:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Não foi possível atualizar o status de lançamento do produto.",
        variant: "destructive",
      });
    }
  };

  const handleToggleOutOfStock = async () => {
    // Se temos acesso ao form, apenas atualiza o estado do form
    if (form) {
      const currentValue = form.getValues('outOfStock');
      form.setValue('outOfStock', !currentValue);
      return;
    }

    // Senão, atualiza diretamente no banco (para uso no modal de detalhes)
    try {
      const { error } = await supabase
        .from('products')
        .update({ out_of_stock: !product.outOfStock })
        .eq('id', product._id);

      if (error) throw error;

      // Atualiza o estado do produto no componente pai
      product.outOfStock = !product.outOfStock;
      
      toast({
        title: "Produto atualizado",
        description: `O produto ${product.name} foi ${product.outOfStock ? 'marcado' : 'desmarcado'} como sem estoque.`,
      });

      // Chama a função do componente pai se fornecida
      if (onToggleOutOfStock) {
        await onToggleOutOfStock(product._id, product.outOfStock);
      }

    } catch (error) {
      console.error('Error updating product out of stock status:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Não foi possível atualizar o status de estoque do produto.",
        variant: "destructive",
      });
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

        <div>
          <h3 className="font-semibold">Sem Estoque</h3>
          <Switch
            checked={form ? form.watch('outOfStock') : product.outOfStock}
            onCheckedChange={handleToggleOutOfStock}
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
