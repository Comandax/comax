
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";

export const useIndexData = () => {
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
      try {
        console.log('📡 Fazendo requisição ao Supabase para shortName:', shortName);
        
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('short_name', shortName)
          .maybeSingle();

        console.log('📦 Resposta do Supabase:', { data, error });

        if (error) {
          throw error;
        }

        if (!data) {
          console.log('⚠️ Nenhuma empresa encontrada para shortName:', shortName);
          setError("Empresa não encontrada. Por favor, verifique se o endereço está correto.");
        } else {
          console.log('✅ Empresa encontrada:', data);
          setCompany(data);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar empresa:', error);
        setError("Erro ao carregar informações da empresa.");
        toast({
          title: "Erro ao carregar informações da empresa",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [shortName, toast, navigate]);

  const {
    products,
    isLoading: isLoadingProducts,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
  } = useInfiniteProducts(company?.id);

  return {
    company,
    products,
    isLoading,
    isLoadingProducts,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    error,
    shortName
  };
};
