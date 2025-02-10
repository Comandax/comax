
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onSubmit: (data: ProductFormData) => Promise<void>;
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

  const handleToggleStatus = async (productId: string, disabled: boolean) => {
    await onToggleStatus(productId, disabled);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o produto selecionado
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex gap-6">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
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
                  onCheckedChange={(checked) => handleToggleStatus(product._id, !checked)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tamanhos e Valores</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.sizes.map((size, index) => (
                <div key={index} className="flex justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{size.size}</span>
                  <span className="text-sm text-muted-foreground">
                    R$ {size.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Quantidades Disponíveis</h3>
            <div className="flex flex-wrap gap-2">
              {product.quantities.map((qty, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {qty} un
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => onEdit(product)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Produto</DialogTitle>
                </DialogHeader>
                <ProductForm 
                  onSubmit={onSubmit} 
                  initialData={product} 
                  onComplete={() => onOpenChange(false)}
                />
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
                  <AlertDialogAction onClick={() => {
                    onDelete(product._id);
                    onOpenChange(false);
                  }}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
