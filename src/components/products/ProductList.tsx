
import type { Product, ProductFormData } from "@/types/product";
import { ProductTable } from "./table/ProductTable";
import { useState } from "react";
import { ProductDetailsModal } from "./details/ProductDetailsModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageX, Plus, Search } from "lucide-react";
import { LoadingState } from "@/components/index/LoadingState";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => Promise<void>;
  onSubmit?: (data: ProductFormData, isEditing: boolean) => Promise<void>;
  onToggleStatus?: (productId: string, disabled: boolean) => Promise<void>;
  isLoading?: boolean;
}

type SortField = 'reference' | 'name';
type SortOrder = 'asc' | 'desc';

export function ProductList({ products, onEdit, onDelete, onSubmit, onToggleStatus, isLoading = false }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('reference');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="p-8 bg-white/95">
        <LoadingState />
      </Card>
    );
  }

  if (!products.length) {
    return (
      <Card className="p-8 text-center space-y-4 bg-white/95">
        <PackageX className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-2xl font-semibold">Nenhum produto cadastrado</h2>
        <p className="text-muted-foreground">
          Clique no botão "Novo Produto" abaixo para começar a cadastrar seus produtos.
        </p>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </Card>
    );
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleToggleStatus = async (productId: string, disabled: boolean) => {
    if (onToggleStatus) {
      await onToggleStatus(productId, disabled);
      
      if (selectedProduct && selectedProduct._id === productId) {
        setSelectedProduct({
          ...selectedProduct,
          disabled: disabled
        });
      }
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredProducts = products.filter(product => {
    const searchMatch = search.toLowerCase() === '' || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.reference.toLowerCase().includes(search.toLowerCase());
    const activeMatch = !showOnlyActive || !product.disabled;
    return searchMatch && activeMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const compareValue = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'reference') {
      return a.reference > b.reference ? compareValue : -compareValue;
    }
    return a.name > b.name ? compareValue : -compareValue;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <Card className="bg-white/95">
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-sm relative">
            <Input
              placeholder="Buscar por nome ou referência..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Produto
            </Button>

            <div className="flex items-center gap-2">
              <Switch
                checked={showOnlyActive}
                onCheckedChange={setShowOnlyActive}
                id="active-filter"
              />
              <Label htmlFor="active-filter">Mostrar apenas ativos</Label>
            </div>

            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Itens por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 itens</SelectItem>
                <SelectItem value="10">10 itens</SelectItem>
                <SelectItem value="20">20 itens</SelectItem>
                <SelectItem value="50">50 itens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border">
          <ProductTable
            products={currentProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            onSubmit={onSubmit}
            onToggleStatus={handleToggleStatus}
            onProductClick={handleProductClick}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "ghost"}
                      className={currentPage === page ? "pointer-events-none" : ""}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onToggleStatus={handleToggleStatus}
      />
    </Card>
  );
}
