
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { ProductForm } from "../ProductForm";
import type { Product, ProductFormData } from "@/types/product";

interface ProductActionsProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => Promise<void>;
  onSubmit?: (data: ProductFormData) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export function ProductActions({ 
  product, 
  onEdit, 
  onDelete, 
  onSubmit,
  onOpenChange 
}: ProductActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
      onOpenChange(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(product._id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitEdit = async (data: ProductFormData) => {
    if (!onSubmit) return;
    
    try {
      await onSubmit(data);
      setIsEditing(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Editar Produto</h3>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </div>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmitEdit}
          onComplete={() => setIsEditing(false)}
        />
      </div>
    );
  }

  if (!onEdit && !onDelete) return null;

  return (
    <div className="flex gap-2">
      {onEdit && (
        <Button onClick={handleEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      )}
      {onDelete && (
        <Button 
          onClick={handleDelete} 
          variant="destructive" 
          size="sm"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? "Excluindo..." : "Excluir"}
        </Button>
      )}
    </div>
  );
}
