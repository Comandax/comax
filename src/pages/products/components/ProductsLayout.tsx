
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Building2, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProductsLayoutProps {
  children: React.ReactNode;
  userName: string;
  userInitials: string;
  onLogout: () => Promise<void>;
}

export function ProductsLayout({ children, userName, userInitials, onLogout }: ProductsLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80"
                    onClick={() => navigate('/admin')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <img 
                    src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
                    alt="COMAX Logo" 
                    className="h-8 w-auto cursor-pointer"
                    onClick={() => navigate('/admin')}
                  />
                </div>
                <h1 className="text-xl font-semibold text-white">Produtos</h1>
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
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
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
      </div>

      <div className="container mx-auto py-10">
        <div className="max-w-6xl mx-auto px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
