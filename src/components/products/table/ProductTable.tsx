
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/product";
import { ProductTableActions } from "./ProductTableActions";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
  onProductClick: (product: Product) => void;
}

export function ProductTable({ 
  products, 
  onEdit, 
  onDelete, 
  onSubmit, 
  onToggleStatus,
  onProductClick 
}: ProductTableProps) {
  const handleToggleStatus = async (productId: string, disabled: boolean, event?: React.MouseEvent) => {
    event?.stopPropagation();
    await onToggleStatus(productId, disabled);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imagem</TableHead>
          <TableHead>Referência</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow 
            key={product._id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onProductClick(product)}
          >
            <TableCell>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            </TableCell>
            <TableCell>{product.reference}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={!product.disabled}
                onCheckedChange={(checked) => handleToggleStatus(product._id, !checked)}
              />
            </TableCell>
            <TableCell className="text-right">
              <ProductTableActions
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onSubmit={onSubmit}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
