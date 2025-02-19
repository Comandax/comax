
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/services/productService";
import { LoadingState } from "@/components/index/LoadingState";
import { NotFoundState } from "@/components/index/NotFoundState";
import { CompanyInfo } from "@/components/index/CompanyInfo";
import { OrderForm } from "@/components/index/OrderForm";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const params = useParams();
  const navigate = useNavigate();
  const shortName = params.shortName;

  useEffect(() => {
    console.log('🔍 Iniciando busca da empresa com shortName:', shortName);
    
    if (!shortName) {
      console.log('❌ shortName não fornecido, redirecionando para login');
      navigate('/login');
      return;
    }

    const fetchCompany = async () => {
      console.log('📡 Fazendo requisição ao Supabase para shortName:', shortName);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('short_name', shortName)
        .maybeSingle();

      console.log('📦 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro ao buscar empresa:', error);
        setError("Erro ao carregar informações da empresa.");
        toast({
          title: "Erro ao carregar informações da empresa",
          variant: "destructive",
        });
      } else if (!data) {
        console.log('⚠️ Nenhuma empresa encontrada para shortName:', shortName);
        setError("Empresa não encontrada. Por favor, verifique se o endereço está correto.");
      } else {
        console.log('✅ Empresa encontrada:', data);
        setCompany(data);
      }
      setIsLoading(false);
    };

    fetchCompany();
  }, [shortName, toast, navigate]);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', company?.id],
    queryFn: () => {
      console.log('🔍 Buscando produtos para empresa:', company?.id);
      return fetchProducts(company?.id || '');
    },
    enabled: !!company?.id,
  });

  if (isLoading) return <LoadingState />;
  if (error || !company) return <NotFoundState error={error} />;

  return (
    <div className="flex flex-col min-h-screen h-full bg-background">
      <CompanyInfo company={company} />
      
      <div className="container mx-auto px-4 py-2 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-center">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Simulações e Pedidos
            </span>
          </h1>

          <Card className="border-border/30 bg-surfaceContainerLowest shadow-lg backdrop-blur-sm p-8">
            <OrderForm 
              companyId={company.id} 
              products={products} 
              isLoading={isLoadingProducts} 
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
