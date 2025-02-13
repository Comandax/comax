
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import type { Product, ProductFormData } from "@/types/product";

interface ProductsHeaderProps {
  isPublicView: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export const ProductsHeader = ({
  isPublicView,
  dialogOpen,
  setDialogOpen,
  selectedProduct,
  setSelectedProduct,
  onSubmit,
}: ProductsHeaderProps) => {
  if (isPublicView) {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedProduct ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          onSubmit={onSubmit} 
          initialData={selectedProduct || undefined} 
          onComplete={() => {
            setDialogOpen(false);
            setSelectedProduct(null);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

