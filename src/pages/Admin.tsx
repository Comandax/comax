
import { Menu } from "lucide-react";
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

const Admin = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roles?.includes('representative')) {
    return <Navigate to="/users" replace />;
  }

  const { data: userCompany, isError, refetch } = useQuery({
    queryKey: ['company', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching company:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user
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

      return (data || []).map(order => ({
        _id: order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerCity: order.customer_city,
        customerState: order.customer_state,
        customerZipCode: order.customer_zip_code,
        date: order.date,
        time: order.time,
        items: (order.items as any[]).map((item: any) => ({
          productId: item.productId,
          reference: item.reference,
          name: item.name,
          sizes: item.sizes.map((size: any) => ({
            size: size.size,
            price: size.price,
            quantity: size.quantity,
            subtotal: size.subtotal
          }))
        })),
        total: order.total,
        companyId: order.company_id,
        notes: order.notes || undefined
      }));
    },
    enabled: !!userCompany?.id
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white lg:bg-white lg:dark:bg-white">
          <SidebarHeader className="bg-white">
            <CompanyHeader company={userCompany} />
          </SidebarHeader>
          <SidebarContent className="px-4 bg-white">
            <AdminSidebarMenu userId={user.id} onLogout={handleLogout} />
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-onSurface">
              Painel Administrativo
            </h1>
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SidebarTrigger>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentOrdersCard
              orders={recentOrders}
              isLoading={isLoadingOrders}
            />
            
            {userCompany && (
              <PublicLinkCard
                companyShortName={userCompany.short_name}
                onEdit={() => setIsEditModalOpen(true)}
              />
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
      </div>
    </SidebarProvider>
  );
};

export default Admin;
