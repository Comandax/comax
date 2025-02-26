
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyEditShortNameModal } from "@/components/companies/details/CompanyEditShortNameModal";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { CompanyHeader } from "@/components/admin/CompanyHeader";
import { AdminSidebarMenu } from "@/components/admin/AdminSidebarMenu";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/admin/dashboard/DashboardContent";
import { CompanyDetailsDialog } from "@/components/companies/details/CompanyDetailsDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

const Admin = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCompanyRegisterOpen, setIsCompanyRegisterOpen] = useState(false);
  const [isEditShortNameOpen, setIsEditShortNameOpen] = useState(false);

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
        .select('*')
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

  const { data: productsCount = 0 } = useQuery({
    queryKey: ['products-count', userCompany?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', userCompany?.id);

      if (error) {
        console.error('Error fetching products count:', error);
        throw error;
      }

      return count || 0;
    },
    enabled: !!userCompany?.id,
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

      return data.map((order) => ({
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
          <DashboardHeader />
          
          <DashboardContent 
            company={userCompany}
            productsCount={productsCount}
            recentOrders={recentOrders}
            isLoadingOrders={isLoadingOrders}
            onEditLink={() => setIsEditShortNameOpen(true)}
            onRegisterCompany={() => setIsCompanyRegisterOpen(true)}
            onDisplayModeSuccess={() => refetch()}
          />
        </main>

        {userCompany && (
          <>
            <CompanyDetailsDialog
              company={userCompany}
              open={isDetailsOpen}
              onOpenChange={setIsDetailsOpen}
              onSuccess={refetch}
            />
            
            <CompanyEditShortNameModal
              open={isEditShortNameOpen}
              onOpenChange={setIsEditShortNameOpen}
              companyId={userCompany.id}
              currentShortName={userCompany.short_name}
              onSuccess={() => {
                refetch();
              }}
            />
          </>
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
