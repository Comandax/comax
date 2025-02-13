
import { LayoutDashboard, Package, Building2, LogOut, User } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

const Admin = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!user) {
    return <Navigate to="/login" replace />;
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
    enabled: !!user,
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
    enabled: !!user,
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

  const isSuperuser = userRoles?.some(role => role.role === 'superuser');

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="py-1.5">
              <img 
                src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
                alt="COMAX Logo" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
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
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/companies')}>
                    <Building2 className="mr-2 h-4 w-4" />
                    {isSuperuser ? "Gerenciar Empresas" : userCompany ? "Minha Empresa" : "Criar Empresa"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {userCompany && (
            <Card className="p-6 mb-8 bg-white/95">
              <div className="flex items-center gap-4">
                {userCompany.logo_url && (
                  <img 
                    src={userCompany.logo_url} 
                    alt={`Logo ${userCompany.name}`}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{userCompany.name}</h2>
                </div>
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/products"
              className="flex items-center p-6 bg-white/95 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Package className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Produtos</h2>
                <p className="text-gray-600">Gerenciar catálogo de produtos</p>
              </div>
            </Link>

            <Link 
              to="/orders"
              className="flex items-center p-6 bg-white/95 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <LayoutDashboard className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Relatório de Pedidos</h2>
                <p className="text-gray-600">Visualizar e gerenciar pedidos</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
