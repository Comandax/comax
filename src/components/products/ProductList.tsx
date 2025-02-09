
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product, ProductFormData } from "@/types/product";
import { ProductForm } from "./ProductForm";
import { useState } from "react";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onToggleStatus: (productId: string, disabled: boolean) => Promise<void>;
}

export function ProductList({ products, onEdit, onDelete, onSubmit, onToggleStatus }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
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
              onClick={() => setSelectedProduct(product)}
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
                  onCheckedChange={(checked) => onToggleStatus(product._id, !checked)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Produto</DialogTitle>
                    </DialogHeader>
                    <ProductForm onSubmit={onSubmit} initialData={product} />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
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
                      <AlertDialogAction onClick={() => onDelete(product._id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Detalhes do Produto */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Produto</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o produto selecionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid gap-6 py-4">
              <div className="flex gap-6">
                <img
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  className="w-48 h-48 object-cover rounded-lg border"
                />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Referência</h3>
                    <p className="text-sm text-muted-foreground">{selectedProduct.reference}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Nome</h3>
                    <p className="text-sm text-muted-foreground">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <Switch
                      checked={!selectedProduct.disabled}
                      onCheckedChange={(checked) => {
                        onToggleStatus(selectedProduct._id, !checked);
                        setSelectedProduct(null);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tamanhos e Valores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProduct.sizes.map((size, index) => (
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
                  {selectedProduct.quantities.map((qty, index) => (
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
                    <Button variant="outline" onClick={() => onEdit(selectedProduct)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Produto</DialogTitle>
                    </DialogHeader>
                    <ProductForm onSubmit={onSubmit} initialData={selectedProduct} />
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
                        onDelete(selectedProduct._id);
                        setSelectedProduct(null);
                      }}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
