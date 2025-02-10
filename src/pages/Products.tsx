
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductList } from "@/components/products/ProductList";
import type { Product, ProductFormData } from "@/types/product";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/services/productService";
import { useCompany } from "@/hooks/useCompany";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { usePublicCompany } from "@/hooks/usePublicCompany";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { company } = useCompany();
  const { companyId } = useParams();
  const { publicCompany, isLoading } = usePublicCompany(companyId);

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
  );
};

export default Products;
