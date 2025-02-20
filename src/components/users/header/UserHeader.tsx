
import { Button } from "@/components/ui/button";
import { LogOut, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserHeaderProps {
  onEditProfile: () => void;
}

export function UserHeader({ onEditProfile }: UserHeaderProps) {
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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/67b9ca3d-df4a-465c-a730-e739b97b5c88.png" 
          alt="Comax Logo" 
          className="h-12 w-auto"
        />
        <h1 className="text-2xl font-bold text-[#403E43]">Painel de Usuários</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onEditProfile}
          className="text-primary hover:bg-primary/10 border-primary"
        >
          <UserCog className="h-5 w-5 mr-2" />
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
  );
}
