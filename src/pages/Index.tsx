
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
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Package, CreditCard } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[40rem] w-[40rem] bg-primary/10 rounded-full blur-3xl dark:bg-primary/30 opacity-20" />
        </div>

        <div className="relative">
          <CompanyInfo company={company} />
          
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8" />
                  Simulações e Pedidos
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Selecione os produtos desejados e as quantidades para cada tamanho. Nosso sistema irá calcular automaticamente o valor total do seu pedido.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Package className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Produtos de Qualidade</h3>
                    <p className="text-sm text-muted-foreground">Seleção cuidadosa de produtos para sua necessidade</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Pedido Simplificado</h3>
                    <p className="text-sm text-muted-foreground">Process de pedido rápido e intuitivo</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <CreditCard className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Pagamento Seguro</h3>
                    <p className="text-sm text-muted-foreground">Transações seguras e confiáveis</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
                <CardContent className="p-6 space-y-6 relative">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
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
        </div>
      </main>
    </div>
  );
};

export default Index;
