
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/services/productService";
import { LoadingState } from "@/components/index/LoadingState";
import { NotFoundState } from "@/components/index/NotFoundState";
import { CompanyInfo } from "@/components/index/CompanyInfo";
import { OrderForm } from "@/components/index/OrderForm";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

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

  console.log('🔄 Estado atual:', {
    isLoading,
    error,
    company,
    productsCount: products.length,
    isLoadingProducts
  });

  if (isLoading) {
    console.log('⏳ Exibindo estado de carregamento');
    return <LoadingState />;
  }

  if (error || !company) {
    console.log('❌ Exibindo estado de erro:', error);
    return <NotFoundState error={error} />;
  }

  console.log('✅ Renderizando página principal');
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1">
        <CompanyInfo company={company} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
              Simulações e Pedidos
            </h1>

            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
              <CardContent className="p-6 space-y-6 relative">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary" />
                    Faça seu Pedido
                  </h2>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                  <OrderForm 
                    companyId={company.id} 
                    products={products} 
                    isLoading={isLoadingProducts} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
