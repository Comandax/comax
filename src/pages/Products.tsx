import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/hooks/useCompany";
import { usePublicCompany } from "@/hooks/usePublicCompany";
import { ProductList } from "@/components/products/ProductList";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { LoadingState } from "@/components/index/LoadingState";
import { NoCompanyState } from "./products/components/NoCompanyState";
import { ProductsLayout } from "./products/components/ProductsLayout";
import { useUserProfile } from "./products/hooks/useUserProfile";
import { useProducts } from "./products/hooks/useProducts";
import type { Product, ProductFormData } from "@/types/product";
import { createProduct, updateProduct, deleteProduct, toggleProductStatus } from "@/services/productService";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { company, isLoading: isLoadingCompany } = useCompany();
  const { companyId } = useParams();
  const { publicCompany, isLoading: isLoadingPublicCompany } = usePublicCompany(companyId);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { userInitials, userName } = useUserProfile();

  const effectiveCompany = company || publicCompany;
  const isPublicView = !company && !!publicCompany;
  const isLoading = isLoadingCompany || isLoadingPublicCompany;

  const { products, isLoadingProducts, refetch } = useProducts(effectiveCompany?.id);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você será redirecionado para a página de login.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente.",
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

  const onSubmit = async (data: ProductFormData, isEditing: boolean) => {
    try {
      if (!company?.id) {
        throw new Error("Company ID not found");
      }

      if (isEditing) {
        await updateProduct(data._id!, data);
        toast({
          title: "Produto atualizado com sucesso!",
        });
      } else {
        await createProduct(data, company.id);
        toast({
          title: "Produto criado com sucesso!",
        });
      }

      await refetch();
      setDialogOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error("Error submitting product:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar produto",
        description: error?.message || "Por favor, tente novamente.",
      });
    }
  };

  const handleToggleStatus = async (productId: string, disabled: boolean) => {
    try {
      await toggleProductStatus(productId, disabled);
      await refetch();
      toast({
        title: `Produto ${disabled ? "desativado" : "ativado"} com sucesso!`,
      });
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast({
        title: "Erro ao alterar status do produto",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C]">
        <div className="container mx-auto py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!isPublicView && !company) {
    return <NoCompanyState />;
  }

  if (!effectiveCompany) {
    return <div>Empresa não encontrada</div>;
  }

  return (
    <ProductsLayout userName={userName} userInitials={userInitials} onLogout={handleLogout}>
      <CompanyHeader 
        logo_url={effectiveCompany?.logo_url}
        name={effectiveCompany?.name || ''}
        isPublicView={isPublicView}
        onNewProduct={() => {
          setSelectedProduct(null);
          setDialogOpen(true);
        }}
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
        isLoading={isLoadingProducts}
        onEdit={isPublicView ? undefined : handleEdit}
        onDelete={isPublicView ? undefined : handleDelete}
        onSubmit={isPublicView ? undefined : (data, isEditing) => onSubmit(data, isEditing)}
        onToggleStatus={isPublicView ? undefined : handleToggleStatus}
      />
    </ProductsLayout>
  );
};

export default Products;
