import { Package, LogOut, User, Building2, ClipboardList, Menu, Share2, ExternalLink, Copy, Edit, ArrowRight } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyEditShortNameModal } from "@/components/companies/details/CompanyEditShortNameModal";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Order, OrderItem } from "@/types/order";
import type { Json } from "@/integrations/supabase/types";

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
        })) as OrderItem[],
        total: order.total,
        companyId: order.company_id,
        notes: order.notes || undefined
      }));
    },
    enabled: !!userCompany?.id
  });

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${userCompany?.short_name}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para sua área de transferência."
    });
  };

  const handleOpenLink = () => {
    const link = `${window.location.origin}/${userCompany?.short_name}`;
    window.open(link, '_blank');
  };

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-6">
            <div className="flex flex-col items-center space-y-4">
              {userCompany?.logo_url ? (
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <img
                    src={userCompany.logo_url}
                    alt={`Logo ${userCompany.name}`}
                    className="relative w-32 h-32 object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                  <Building2 className="w-16 h-16 text-primary/50" />
                </div>
              )}
              <div className="w-full text-center">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {userCompany?.name || 'Empresa'}
                </h2>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/products" 
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Package className="w-5 h-5 text-primary" />
                    <span className="font-medium">Produtos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/orders" 
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <ClipboardList className="w-5 h-5 text-primary" />
                    <span className="font-medium">Pedidos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to={`/profile/${user.id}`} 
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">Meu Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SidebarTrigger>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card de Pedidos Recentes */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
              <CardContent className="p-6 space-y-6 relative">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Pedidos Recentes
                  </h2>
                </div>

                <div className="space-y-4">
                  {isLoadingOrders ? (
                    <div className="text-center py-8 text-gray-500">
                      Carregando pedidos...
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div 
                          key={order._id} 
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="w-[35%]">
                              <p className="text-sm font-medium text-gray-500 truncate">
                                {formatDate(order.date)}
                              </p>
                              <h3 className="font-semibold text-gray-900 dark:text-white mt-1 truncate">
                                {order.customerName}
                              </h3>
                            </div>
                            <div className="min-w-[30%] text-center">
                              <p className="text-sm text-gray-500">
                                {order.customerCity} / {order.customerState}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-primary">
                                {formatCurrency(order.total)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        asChild
                        className="w-full"
                        variant="outline"
                      >
                        <Link to="/orders" className="flex items-center justify-center gap-2">
                          <span>Ver todos os pedidos</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum pedido encontrado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 pointer-events-none" />
              <CardContent className="p-6 space-y-6 relative">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-secondary to-primary rounded-full" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                    Link para Pedidos
                  </h2>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                      <Share2 className="w-5 h-5 text-secondary" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Link público para seus clientes fazerem pedidos
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {`${window.location.origin}/${userCompany?.short_name}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-white dark:bg-gray-900"
                        onClick={handleCopyLink}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white dark:bg-gray-900"
                        onClick={handleOpenLink}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white dark:bg-gray-900"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
