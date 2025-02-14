
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
  const userInitials = userProfile ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase() : 'U';
  const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Usuário';
  const { user } = useAuth();

  return (
    <>
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-white hover:text-white/80">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <img 
                    src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
                    alt="COMAX Logo" 
                    className="h-8 w-auto cursor-pointer" 
                    onClick={() => navigate('/admin')} 
                  />
                </div>
                <h1 className="text-xl font-semibold text-white">Pedidos</h1>
              </div>
              
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

      {company && (
        <div className="bg-white/5 border-b border-white/10">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center gap-4 py-2">
                {company.logo_url && (
                  <img 
                    src={company.logo_url} 
                    alt={`Logo ${company.name}`} 
                    className="w-8 h-8 object-contain rounded" 
                  />
                )}
                <h2 className="text-sm font-medium text-white/90">{company.name}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
