
import { Package, LogOut, User, Building2, ClipboardList, Menu } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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

const Admin = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roles?.includes('representative')) {
    return <Navigate to="/users" replace />;
  }

  const { data: userCompany, isError } = useQuery({
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

  const { data: userRoles } = useQuery({
    queryKey: ['user_roles', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
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
    enabled: !!user
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
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-6">
            <div className="flex flex-col items-center space-y-4">
              {userCompany?.logo_url && (
                <img
                  src={userCompany.logo_url}
                  alt={`Logo ${userCompany.name}`}
                  className="w-32 h-32 object-contain"
                />
              )}
              <div className="w-full text-center">
                <h2 className="text-xl font-semibold text-foreground">
                  {userCompany?.name || 'Empresa'}
                </h2>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/products" className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Produtos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/orders" className="flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5" />
                    <span>Pedidos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={`/profile/${user.id}`} className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Meu Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="flex items-center space-x-2 text-destructive hover:text-destructive/90">
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[#403E43]">Painel Administrativo</h1>
            <SidebarTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SidebarTrigger>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-primary">Módulos</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link 
                  to="/products" 
                  className="group flex items-center p-6 bg-white rounded-lg border border-primary/20 hover:border-primary/30 transition-all duration-300"
                >
                  <Package className="w-8 h-8 text-primary mr-4" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">Produtos</h2>
                    <p className="text-muted-foreground">Gerenciar catálogo de produtos</p>
                  </div>
                </Link>

                <Link 
                  to="/orders" 
                  className="group flex items-center p-6 bg-white rounded-lg border border-primary/20 hover:border-primary/30 transition-all duration-300"
                >
                  <ClipboardList className="w-8 h-8 text-primary mr-4" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">Relatório de Pedidos</h2>
                    <p className="text-muted-foreground">Visualizar e gerenciar pedidos</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
