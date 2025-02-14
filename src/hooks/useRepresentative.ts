
import { useQuery } from "@tanstack/react-query";
import { getCurrentRepresentative, getRepresentativeCompanies } from "@/services/representativeService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function useRepresentative() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: representative, isLoading: isLoadingRepresentative, error: representativeError } = useQuery({
    queryKey: ['representative', user?.id],
    queryFn: getCurrentRepresentative,
    enabled: !!user && user.roles?.includes('representative'),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    retry: 1,
    gcTime: 10 * 60 * 1000,
    meta: {
      onError: (error: Error) => {
        console.error('Erro ao carregar dados do representante:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do representante. Por favor, tente novamente.",
        });
      }
    }
  });

  const { data: companies = [], isLoading: isLoadingCompanies, error: companiesError } = useQuery({
    queryKey: ['representative-companies', representative?.id],
    queryFn: () => getRepresentativeCompanies(representative!.id),
    enabled: !!representative,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    retry: 1,
    gcTime: 10 * 60 * 1000,
    meta: {
      onError: (error: Error) => {
        console.error('Erro ao carregar empresas do representante:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar empresas",
          description: "Não foi possível carregar a lista de empresas. Por favor, tente novamente.",
        });
      }
    }
  });

  return {
    representative,
    companies,
    isLoading: isLoadingRepresentative || isLoadingCompanies,
    error: representativeError || companiesError,
  };
}
