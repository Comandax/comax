
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
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

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products", "1"], // Hardcoded companyId for now
    queryFn: () => fetchProducts("1"),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log("Form submitted:", data);
      toast({
        title: selectedProduct
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!",
      });
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
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
      />
    </div>
  );
};

export default Products;
