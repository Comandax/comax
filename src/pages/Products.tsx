
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductList } from "@/components/products/ProductList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product, ProductFormData } from "@/types/product";
import { fetchProducts } from "@/services/productService";
import { useCompany } from "@/hooks/useCompany";
import { Card } from "@/components/ui/card";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { company } = useCompany();

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products", company?.id],
    queryFn: () => fetchProducts(company?.id || ""),
    enabled: !!company?.id,
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log("Form submitted:", data);
      toast({
        title: selectedProduct
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!",
      });
      setDialogOpen(false); // Close the dialog after successful submission
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      console.log("Deleting product:", productId);
      toast({
        title: "Produto excluído com sucesso!",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (productId: string, disabled: boolean) => {
    try {
      console.log("Toggling product status:", { productId, disabled });
      // Optimistically update the UI
      queryClient.setQueryData(["products", company?.id], (oldData: Product[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((product) =>
          product._id === productId ? { ...product, disabled } : product
        );
      });
      
      toast({
        title: `Produto ${disabled ? "desativado" : "ativado"} com sucesso!`,
      });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["products", company?.id] });
      toast({
        title: "Erro ao alterar status do produto",
        variant: "destructive",
      });
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="p-6 mb-8 bg-white/90">
        <div className="flex items-center gap-4">
          {company.logo_url && (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`}
              className="w-16 h-16 object-contain rounded-lg"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          </div>
        </div>
      </Card>

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
            <ProductForm onSubmit={onSubmit} initialData={selectedProduct || undefined} />
          </DialogContent>
        </Dialog>
      </div>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSubmit={onSubmit}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default Products;
