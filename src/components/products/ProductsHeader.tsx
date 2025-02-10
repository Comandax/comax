
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    return (
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Produtos</h1>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setSelectedProduct(null)}>
            <Plus className="mr-2" />
            Novo Produto
          </Button>
        </DialogTrigger>
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
    </div>
  );
};
