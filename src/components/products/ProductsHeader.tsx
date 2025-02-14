
import { ProductForm } from "./ProductForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Product, ProductFormData } from "@/types/product";
import { Dispatch, SetStateAction } from "react";

interface ProductsHeaderProps {
  isPublicView: boolean;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedProduct: Product | null;
  setSelectedProduct: Dispatch<SetStateAction<Product | null>>;
  onSubmit: (data: ProductFormData, isEditing: boolean) => Promise<void>;
}

export const ProductsHeader = ({
  isPublicView,
  dialogOpen,
  setDialogOpen,
  selectedProduct,
  setSelectedProduct,
  onSubmit
}: ProductsHeaderProps) => {
  if (isPublicView) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <ProductForm
          initialData={selectedProduct || undefined}
          onSubmit={(data) => onSubmit(data, !!selectedProduct)}
          onComplete={() => {
            setDialogOpen(false);
            setSelectedProduct(null);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
