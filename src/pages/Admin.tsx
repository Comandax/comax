
import { LayoutDashboard, Package, Building2, LogOut } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // If user is not logged in, redirect to login page
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

  const isSuperuser = user?.roles?.includes('superuser');
  const showCompanyButton = isSuperuser || userCompany !== null;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {isSuperuser ? "Gerenciar Empresas" : userCompany ? "Minha Empresa" : "Criar Empresa"}
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/products"
          className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Package className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Produtos</h2>
            <p className="text-gray-600">Gerenciar catálogo de produtos</p>
          </div>
        </Link>

        <Link 
          to="/orders"
          className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <LayoutDashboard className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Relatório de Pedidos</h2>
            <p className="text-gray-600">Visualizar e gerenciar pedidos</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
