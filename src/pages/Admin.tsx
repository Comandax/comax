
import { Menu, Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CompanyEditShortNameModal } from "@/components/companies/details/CompanyEditShortNameModal";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CompanyHeader } from "@/components/admin/CompanyHeader";
import { AdminSidebarMenu } from "@/components/admin/AdminSidebarMenu";
import { RecentOrdersCard } from "@/components/admin/RecentOrdersCard";
import { PublicLinkCard } from "@/components/admin/PublicLinkCard";
import { DisplayModeCard } from "@/components/admin/DisplayModeCard";
import { NoCompanyRegisteredCard } from "@/components/admin/NoCompanyRegisteredCard";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Order } from "@/types/order";

const Admin = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompanyRegisterOpen, setIsCompanyRegisterOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roles?.includes('representative')) {
    return <Navigate to="/users" replace />;
  }

  const { data: userCompany, isError, isLoading: isLoadingCompany, refetch } = useQuery({
    queryKey: ['company', user?.id],
    queryFn: async () => {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*, products:products(count)')
        .eq('owner_id', user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching company:', error);
        throw error;
      }

      return company;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { data: recentOrders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['recent-orders', userCompany?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('company_id', userCompany?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent orders:', error);
        throw error;
      }

      // Mapear os dados do banco para o formato esperado pelo tipo Order
      return (data || []).map((order): Order => ({
        _id: order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerCity: order.customer_city,
        customerState: order.customer_state,
        customerZipCode: order.customer_zip_code,
        date: order.date,
        time: order.time,
        items: Array.isArray(order.items) 
          ? order.items.map((item: any) => ({
              productId: item.productId,
              reference: item.reference,
              name: item.name,
              sizes: Array.isArray(item.sizes) 
                ? item.sizes.map((size: any) => ({
                    size: size.size,
                    price: size.price,
                    quantity: size.quantity,
                    subtotal: size.subtotal
                  }))
                : []
            }))
          : [],
        total: order.total,
        companyId: order.company_id,
        notes: order.notes || undefined
      }));
    },
    enabled: !!userCompany?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você será redirecionado para a página de login."
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente."
      });
    }
  };

  const handleCompanyRegisterSuccess = () => {
    setIsCompanyRegisterOpen(false);
    refetch();
    toast({
      title: "Empresa cadastrada com sucesso",
      description: "Agora você pode começar a cadastrar seus produtos."
    });
  };

  const isLoading = isLoadingCompany || isLoadingOrders;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  const productsCount = userCompany?.products?.[0]?.count || 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border/40 bg-card shadow-lg">
          <SidebarHeader className="bg-card/50 backdrop-blur-sm">
            <CompanyHeader company={userCompany} />
          </SidebarHeader>
          <SidebarContent className="px-4 pt-4 bg-card/50 backdrop-blur-sm">
            <AdminSidebarMenu userId={user.id} onLogout={handleLogout} />
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground/90 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-lg text-muted-foreground">
                Bem-vindo ao seu painel de controle
              </p>
            </div>
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-6 w-6 text-foreground/70" />
              </Button>
            </SidebarTrigger>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-muted/60 hover:border-primary/20 transition-colors">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Produtos</h3>
                  <div className="text-2xl font-bold text-foreground/90">
                    {productsCount}
                  </div>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-sm border border-muted/60 hover:border-primary/20 transition-colors">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Pedidos</h3>
                  <div className="text-2xl font-bold text-foreground/90">
                    {recentOrders.length}
                  </div>
                </div>
              </div>
              <RecentOrdersCard
                orders={recentOrders}
                isLoading={isLoadingOrders}
              />
            </div>
            
            {userCompany ? (
              <div className="grid grid-rows-2 gap-6 h-full">
                <PublicLinkCard
                  companyShortName={userCompany.short_name}
                  onEdit={() => setIsEditModalOpen(true)}
                />
                <DisplayModeCard
                  companyId={userCompany.id}
                  currentMode={userCompany.display_mode}
                  onSuccess={() => {
                    refetch();
                  }}
                />
              </div>
            ) : (
              <div className="h-full">
                <NoCompanyRegisteredCard onRegisterClick={() => setIsCompanyRegisterOpen(true)} />
              </div>
            )}
          </div>
        </main>

        {userCompany && (
          <CompanyEditShortNameModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            companyId={userCompany.id}
            currentShortName={userCompany.short_name}
            onSuccess={() => {
              refetch();
            }}
          />
        )}

        <Dialog open={isCompanyRegisterOpen} onOpenChange={setIsCompanyRegisterOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Empresa</DialogTitle>
            </DialogHeader>
            <CompanyForm onSubmitSuccess={handleCompanyRegisterSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
