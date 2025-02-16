
import { Package, LogOut, User, Building2, ClipboardList, Copy } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

  const handleCopyLink = () => {
    if (userCompany) {
      navigator.clipboard.writeText(`${window.location.origin}/${userCompany.short_name}`);
      toast({
        title: "Link copiado!",
        description: "O link para pedidos foi copiado para sua área de transferência."
      });
    }
  };

  const userInitials = userProfile ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase() : 'U';
  const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Usuário';
  const isSuperuser = userRoles?.some(role => role.role === 'superuser');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
              alt="Comax Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-[#403E43]">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/profile/${user.id}`)}
              className="text-primary hover:bg-primary/10 border-primary"
            >
              <User className="h-5 w-5 mr-2" />
              Editar Perfil
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 border-destructive"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card de Informações da Empresa */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-primary">Informações da Empresa</h2>
              </div>

              {userCompany && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {userCompany.logo_url && (
                      <img
                        src={userCompany.logo_url}
                        alt={`Logo ${userCompany.name}`}
                        className="w-24 h-24 object-contain rounded-lg border border-primary/20"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{userCompany.name}</h3>
                      {userProfile && (
                        <>
                          <p className="text-muted-foreground">Responsável: {userProfile.first_name} {userProfile.last_name}</p>
                          <p className="text-muted-foreground">Email: {userProfile.email}</p>
                          {userProfile.phone && (
                            <p className="text-muted-foreground">Telefone: {userProfile.phone}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Link para Pedidos:</label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={`${window.location.origin}/${userCompany.short_name}`}
                        className="bg-white/80 border-primary/30"
                      />
                      <Button
                        variant="outline"
                        className="text-primary hover:bg-primary/10 border-primary"
                        onClick={handleCopyLink}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Módulos */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-primary">Módulos</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default Admin;
