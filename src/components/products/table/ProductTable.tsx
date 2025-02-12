
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product, ProductFormData } from "@/types/product";
import { ProductTableActions } from "./ProductTableActions";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
  onProductClick: (product: Product) => void;
  sortField?: 'reference' | 'name';
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: 'reference' | 'name') => void;
}

export function ProductTable({ 
  products, 
  onEdit, 
  onDelete, 
  onSubmit, 
  onToggleStatus,
  onProductClick,
  sortField,
  sortOrder,
  onSort
}: ProductTableProps) {
  const handleToggleStatus = async (productId: string, disabled: boolean, event?: React.MouseEvent) => {
    event?.stopPropagation();
    await onToggleStatus(productId, disabled);
  };

  const SortIcon = ({ field }: { field: 'reference' | 'name' }) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />;
  };

  const handleSort = (field: 'reference' | 'name') => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imagem</TableHead>
          <TableHead 
            className="cursor-pointer hover:text-primary"
            onClick={() => handleSort('reference')}
          >
            Referência
            <SortIcon field="reference" />
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:text-primary"
            onClick={() => handleSort('name')}
          >
            Nome
            <SortIcon field="name" />
          </TableHead>
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
            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
