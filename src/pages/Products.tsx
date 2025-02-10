
import React, { useState } from "react";
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
import { fetchProducts, createProduct } from "@/services/productService";
import { useCompany } from "@/hooks/useCompany";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { company } = useCompany();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [publicCompany, setPublicCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch public company data if accessed via URL
  const fetchPublicCompany = async (id: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      return null;
    }
    return data;
  };

  // Effect to fetch public company data when accessed via URL
  React.useEffect(() => {
    if (companyId && !company) {
      fetchPublicCompany(companyId).then((data) => {
        setPublicCompany(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [companyId, company]);

  const effectiveCompany = company || publicCompany;
  const isPublicView = !company && !!publicCompany;

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products", effectiveCompany?.id],
    queryFn: () => fetchProducts(effectiveCompany?.id || ""),
    enabled: !!effectiveCompany?.id,
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (!company?.id) {
        throw new Error("Company ID not found");
      }

      await createProduct(data, company.id);
      
      toast({
        title: selectedProduct
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!",
      });
      setDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving product:', error);
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
      queryClient.setQueryData(["products", effectiveCompany?.id], (oldData: Product[] | undefined) => {
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
      queryClient.invalidateQueries({ queryKey: ["products", effectiveCompany?.id] });
      toast({
        title: "Erro ao alterar status do produto",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!effectiveCompany) {
    return <div>Empresa não encontrada</div>;
  }

  return (
    <div className="container mx-auto py-10">
      {!isPublicView && (
        <Card 
          className="p-6 mb-8 bg-white/90 cursor-pointer hover:bg-white/95 transition-colors"
          onClick={() => navigate("/admin")}
        >
          <div className="flex items-center gap-4">
            {effectiveCompany.logo_url && (
              <img 
                src={effectiveCompany.logo_url} 
                alt={`${effectiveCompany.name} logo`}
                className="w-16 h-16 object-contain rounded-lg"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{effectiveCompany.name}</h2>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        {!isPublicView && (
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
        )}
      </div>

      <ProductList
        products={products}
        onEdit={isPublicView ? undefined : handleEdit}
        onDelete={isPublicView ? undefined : handleDelete}
        onSubmit={isPublicView ? undefined : onSubmit}
        onToggleStatus={isPublicView ? undefined : handleToggleStatus}
      />
    </div>
  );
};

export default Products;

