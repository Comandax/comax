
import type { Product, ProductFormData } from "@/types/product";
import { ProductTable } from "./table/ProductTable";
import { useState } from "react";
import { ProductDetailsModal } from "./details/ProductDetailsModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => Promise<void>;
  onSubmit?: (data: ProductFormData) => Promise<void>;
  onToggleStatus?: (productId: string, disabled: boolean) => Promise<void>;
}

type SortField = 'reference' | 'name';
type SortOrder = 'asc' | 'desc';

export function ProductList({ products, onEdit, onDelete, onSubmit, onToggleStatus }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('reference');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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

  // Filtragem
  const filteredProducts = products.filter(product => {
    const searchMatch = search.toLowerCase() === '' || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.reference.toLowerCase().includes(search.toLowerCase());
    const activeMatch = !showOnlyActive || !product.disabled;
    return searchMatch && activeMatch;
  });

  // Ordenação
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const compareValue = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'reference') {
      return a.reference > b.reference ? compareValue : -compareValue;
    }
    return a.name > b.name ? compareValue : -compareValue;
  });

  // Paginação
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Buscar por nome ou referência..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showOnlyActive}
              onCheckedChange={setShowOnlyActive}
              id="active-filter"
            />
            <Label htmlFor="active-filter">Mostrar apenas ativos</Label>
          </div>

          <Select
            value={sortField}
            onValueChange={(value: SortField) => setSortField(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reference">Referência</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value: SortOrder) => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Crescente</SelectItem>
              <SelectItem value="desc">Decrescente</SelectItem>
            </SelectContent>
          </Select>

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

      <ProductTable
        products={currentProducts}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onToggleStatus={handleToggleStatus}
        onProductClick={handleProductClick}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
