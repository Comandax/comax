
import { UserList } from "@/components/users/UserList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function Users() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

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
        description: "Tente novamente em alguns instantes.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-end mb-8">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </Button>
      </div>
      <UserList />
    </div>
  );
}
