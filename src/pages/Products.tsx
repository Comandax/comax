import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductList } from "@/components/products/ProductList";
import type { Product, ProductFormData } from "@/types/product";
import { fetchProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } from "@/services/productService";
import { useCompany } from "@/hooks/useCompany";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { usePublicCompany } from "@/hooks/usePublicCompany";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/index/LoadingState";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { company, isLoading: isLoadingCompany } = useCompany();
  const { companyId } = useParams();
  const { publicCompany, isLoading: isLoadingPublicCompany } = usePublicCompany(companyId);
  const navigate = useNavigate();

  const effectiveCompany = company || publicCompany;
  const isPublicView = !company && !!publicCompany;
  const isLoading = isLoadingCompany || isLoadingPublicCompany;

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

      if (selectedProduct) {
        await updateProduct(selectedProduct._id, data);
        toast({
          title: "Produto atualizado com sucesso!",
        });
      } else {
        await createProduct(data, company.id);
        toast({
          title: "Produto criado com sucesso!",
        });
      }
      
      setDialogOpen(false);
      setSelectedProduct(null);
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
      await deleteProduct(productId);
      await refetch();
      toast({
        title: "Produto excluído com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao excluir produto",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (productId: string, disabled: boolean) => {
    try {
      // Optimistically update the UI
      queryClient.setQueryData(["products", effectiveCompany?.id], (oldData: Product[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((product) =>
          product._id === productId ? { ...product, disabled } : product
        );
      });

      // Make the API call
      await toggleProductStatus(productId, disabled);
      
      toast({
        title: `Produto ${disabled ? "desativado" : "ativado"} com sucesso!`,
      });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["products", effectiveCompany?.id] });
      console.error('Error toggling product status:', error);
      toast({
        title: "Erro ao alterar status do produto",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!isPublicView && !company) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-4">
            <Building2 className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-2xl font-semibold">Nenhuma empresa cadastrada</h2>
            <p className="text-muted-foreground">
              Para gerenciar produtos, você precisa primeiro cadastrar sua empresa.
            </p>
            <Button 
              onClick={() => navigate('/companies')}
              className="mt-4"
            >
              Cadastrar Empresa
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!effectiveCompany) {
    return <div>Empresa não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        {!isPublicView && (
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para o painel
            </Button>
          </div>
        )}

        <CompanyHeader 
          logo_url={effectiveCompany.logo_url}
          name={effectiveCompany.name}
          isPublicView={isPublicView}
        />

        <ProductsHeader
          isPublicView={isPublicView}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onSubmit={onSubmit}
        />

        <ProductList
          products={products}
          onEdit={isPublicView ? undefined : handleEdit}
          onDelete={isPublicView ? undefined : handleDelete}
          onSubmit={isPublicView ? undefined : onSubmit}
          onToggleStatus={isPublicView ? undefined : handleToggleStatus}
        />
      </div>
    </div>
  );
};

export default Products;
