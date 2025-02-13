import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product, ProductFormData } from "@/types/product";
import { ProductImage } from "./ProductImage";
import { ProductInfo } from "./ProductInfo";
import { ProductSizes } from "./ProductSizes";
import { ProductQuantities } from "./ProductQuantities";
import { ProductActions } from "./ProductActions";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onSubmit: (data: ProductFormData, isEditing: boolean) => Promise<void>;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
  onSubmit,
  onToggleStatus,
}: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" aria-describedby="product-details-description">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
          <DialogDescription id="product-details-description">
            Informações detalhadas sobre o produto selecionado
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex gap-6">
            <ProductImage image={product.image} name={product.name} />
            <ProductInfo product={product} onToggleStatus={onToggleStatus} />
          </div>

          <ProductSizes sizes={product.sizes} />
          <ProductQuantities quantities={product.quantities} />
          <ProductActions 
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onSubmit={(data) => onSubmit(data, !!product.id)}
            onOpenChange={onOpenChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
