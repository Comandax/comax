
import { ProductForm } from "./ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Product, ProductFormData } from "@/types/product";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">
              {selectedProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDialogOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="p-6">
          <ProductForm
            initialData={selectedProduct || undefined}
            onSubmit={(data) => onSubmit(data, !!selectedProduct)}
            onComplete={() => {
              setDialogOpen(false);
              setSelectedProduct(null);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
