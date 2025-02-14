
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/services/productService";
import { LoadingState } from "@/components/index/LoadingState";
import { NotFoundState } from "@/components/index/NotFoundState";
import { CompanyInfo } from "@/components/index/CompanyInfo";
import { OrderForm } from "@/components/index/OrderForm";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="min-h-screen bg-[#1A1F2C]">
      <CompanyInfo company={company} />
      <div className="container mx-auto px-4 py-0">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-white text-center">Simulações e Pedidos</h1>
          <OrderForm 
            companyId={company.id} 
            products={products} 
            isLoading={isLoadingProducts} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
