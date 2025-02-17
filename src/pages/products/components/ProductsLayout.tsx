
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Building2, LogOut, User, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Company } from "@/types/company";

interface ProductsLayoutProps {
  children: React.ReactNode;
  userName: string;
  userInitials: string;
  onLogout: () => Promise<void>;
  company: Company;
}

export function ProductsLayout({
  children,
  userName,
  userInitials,
  onLogout,
  company
}: ProductsLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary hover:text-primary/80 hover:bg-primary/10" 
                  onClick={() => navigate('/admin')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                {company.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt={`${company.name} logo`}
                    className="h-8 w-8 object-contain rounded"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-primary" />
                )}
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {company.name}
                  </h1>
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                    Produtos
                  </span>
                </div>
              </div>
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

      {children}
    </div>
  );
}
