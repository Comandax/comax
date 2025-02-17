
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { User, Building2, LogOut, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Company } from "@/types/company";

interface OrdersHeaderProps {
  userProfile: any;
  company: Company | null;
  onLogout: () => Promise<void>;
}

export const OrdersHeader = ({ userProfile, company, onLogout }: OrdersHeaderProps) => {
  const navigate = useNavigate();
  const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Usuário';
  const { user } = useAuth();

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-gray-700 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                    {company?.logo_url && (
                      <img 
                        src={company.logo_url} 
                        alt={`${company.name} logo`} 
                        className="h-8 w-auto"
                      />
                    )}
                    <span className="text-gray-900 font-medium">{company?.name}</span>
                  </div>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Pedidos</h1>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
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
                  <DropdownMenuItem onClick={() => navigate('/companies')}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Minha Empresa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Removi a segunda barra com informações da empresa pois agora estão na barra principal */}
    </>
  );
};
