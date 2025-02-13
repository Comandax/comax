
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { CompanyList } from "@/components/companies/CompanyList";
import { CompanyDetails } from "@/components/companies/CompanyDetails";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, ExternalLink, Building2, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSuperuser = user?.roles?.includes('superuser');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCompanies();
  }, [user, navigate]);

  const fetchCompanies = async () => {
    if (!user) return;

    let query = supabase
      .from('companies')
      .select('*');

    if (!isSuperuser) {
      query = query.eq('owner_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas",
        variant: "destructive",
      });
      return;
    }

    setCompanies(data || []);
  };

  const toggleCompanyStatus = async (id: string, currentStatus: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('companies')
      .update({ active: !currentStatus })
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da empresa",
        variant: "destructive",
      });
      return;
    }

    fetchCompanies();
  };

  const copyToClipboard = async (shortName: string) => {
    const url = `${window.location.origin}/${shortName}`;
    await navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para sua área de transferência.",
    });
  };

  const openInNewTab = (shortName: string) => {
    const url = `${window.location.origin}/${shortName}`;
    window.open(url, '_blank');
  };

  const handleLogout = async () => {
    try {
      await user?.handleLogout();
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente.",
      });
    }
  };

  if (!user) {
    return null;
  }

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
                    onClick={() => navigate('/admin')}
                    className="text-white hover:text-white/80"
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
                <h1 className="text-xl font-semibold text-white">
                  {isSuperuser ? "Administração de Empresas" : "Minha Empresa"}
                </h1>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem disabled className="font-semibold">
                    {user.userName}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/companies')}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Minha Empresa
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

      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {(isSuperuser || companies.length === 0) && (
            <CompanyForm onSubmitSuccess={fetchCompanies} />
          )}

          {!isSuperuser && companies.length === 1 ? (
            <>
              <Card className="p-6 bg-white/95">
                <CompanyDetails 
                  company={companies[0]}
                  onUpdateSuccess={fetchCompanies}
                />
              </Card>
              <Card className="p-6 bg-white/95">
                <h2 className="text-xl font-semibold mb-4">Link para Pedidos</h2>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      readOnly
                      value={`${window.location.origin}/${companies[0].short_name}`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Button
                        onClick={() => copyToClipboard(companies[0].short_name)}
                        variant="outline"
                        size="icon"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Copiar</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button
                        onClick={() => openInNewTab(companies[0].short_name)}
                        variant="outline"
                        size="icon"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Abrir</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Compartilhe este link com seus clientes para que eles possam fazer pedidos.
                </p>
              </Card>
            </>
          ) : (
            <CompanyList
              companies={companies}
              sortField="name"
              sortOrder="asc"
              onToggleSort={() => {}}
              onToggleStatus={toggleCompanyStatus}
              onUpdateSuccess={fetchCompanies}
              isSuperuser={isSuperuser}
            />
          )}
        </div>
      </div>
    </div>
  );
}
