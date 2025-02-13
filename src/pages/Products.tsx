
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductList } from "@/components/products/ProductList";
import type { Product, ProductFormData } from "@/types/product";
import { fetchProducts, createProduct, updateProduct, deleteProduct, toggleProductStatus } from "@/services/productService";
import { useCompany } from "@/hooks/useCompany";
import { useNavigate, useParams } from "react-router-dom";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { usePublicCompany } from "@/hooks/usePublicCompany";
import { ArrowLeft, User, Building2, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/index/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { company, isLoading: isLoadingCompany } = useCompany();
  const { companyId } = useParams();
  const { publicCompany, isLoading: isLoadingPublicCompany } = usePublicCompany(companyId);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const effectiveCompany = company || publicCompany;
  const isPublicView = !company && !!publicCompany;
  const isLoading = isLoadingCompany || isLoadingPublicCompany;

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products", effectiveCompany?.id],
    queryFn: () => fetchProducts(effectiveCompany?.id || ""),
    enabled: !!effectiveCompany?.id,
  });

  const { data: userProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

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

  const userInitials = userProfile ? 
    `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase() : 
    'U';
  const userName = userProfile ? 
    `${userProfile.first_name} ${userProfile.last_name}` : 
    'Usuário';

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
      <div className="min-h-screen bg-[#1A1F2C]">
        <div className="container mx-auto py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!isPublicView && !company) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center space-y-4 bg-white/95">
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
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80"
                    onClick={() => navigate('/admin')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <img 
                    src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
                    alt="COMAX Logo" 
                    className="h-8 w-auto cursor-pointer"
                    onClick={() => navigate('/admin')}
                  />
                </div>
                <h1 className="text-xl font-semibold text-white">Produtos</h1>
              </div>
              {!isPublicView && (
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem disabled className="font-semibold">
                        {userName}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
                        <User className="mr-2 h-4 w-4" />
                        Meu Perfil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/companies')}>
                        <Building2 className="mr-2 h-4 w-4" />
                        Minha Empresa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <div className="max-w-6xl mx-auto px-4">
          <Card 
            className="p-6 mb-8 bg-white/95 cursor-pointer hover:bg-white transition-colors"
            onClick={() => navigate("/admin")}
          >
            <div className="flex items-center gap-4">
              {effectiveCompany?.logo_url && (
                <img 
                  src={effectiveCompany.logo_url} 
                  alt={`Logo ${effectiveCompany.name}`}
                  className="w-16 h-16 object-contain rounded-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{effectiveCompany.name}</h2>
              </div>
            </div>
          </Card>

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
    </div>
  );
};

export default Products;
