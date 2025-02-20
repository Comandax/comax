
import type { Product, ProductFormData } from "@/types/product";
import { ProductTable } from "./table/ProductTable";
import { useState } from "react";
import { ProductDetailsModal } from "./details/ProductDetailsModal";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/index/LoadingState";
import { EmptyProductList } from "./empty/EmptyProductList";
import { ProductListFilters } from "./filters/ProductListFilters";
import { ProductListPagination } from "./pagination/ProductListPagination";

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => Promise<void>;
  onSubmit?: (data: ProductFormData, isEditing: boolean) => Promise<void>;
  onToggleStatus?: (productId: string, disabled: boolean) => Promise<void>;
  isLoading?: boolean;
  onOpenNewProductModal: () => void;
}

type SortField = 'reference' | 'name';
type SortOrder = 'asc' | 'desc';

export function ProductList({ 
  products, 
  onEdit, 
  onDelete, 
  onSubmit, 
  onToggleStatus,
  onOpenNewProductModal,
  isLoading = false 
}: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('reference');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  if (isLoading) {
    return (
      <Card className="p-8 bg-white/95">
        <LoadingState />
      </Card>
    );
  }

  if (!products.length) {
    return <EmptyProductList onNewProduct={onOpenNewProductModal} />;
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
    <div className="p-6 space-y-6">
      <ProductListFilters
        search={search}
        onSearchChange={setSearch}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        onOpenNewProductModal={onOpenNewProductModal}
      />

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

      <ProductListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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
