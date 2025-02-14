
import { UserList } from "@/components/users/UserList";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

export default function Users() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

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

  const userInitials = userProfile ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase() : 'U';
  const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Usuário';

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-8">
                <img src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" alt="COMAX Logo" className="h-8 w-auto" />
                <h1 className="text-xl font-semibold text-white">Gerenciamento de Usuários</h1>
              </div>
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
                    <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
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
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white/95 rounded-lg shadow-sm p-6">
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
}
