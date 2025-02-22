
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Product, ProductFormData } from "@/types/product";
import { ProductForm } from "../ProductForm";

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onSubmit: (data: ProductFormData, isEditing: boolean) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export function ProductActions({ 
  product, 
  onEdit, 
  onDelete, 
  onSubmit, 
  onOpenChange 
}: ProductActionsProps) {
  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit(data, true); // Sempre true porque estamos editando
    onOpenChange(false);
  };

  return (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={(e) => e.stopPropagation()}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[80vh] pr-4">
            <ProductForm 
              onSubmit={handleSubmit} 
              initialData={product} 
              onComplete={() => onOpenChange(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(product._id);
                onOpenChange(false);
              }}
              className="text-onPrimary"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
