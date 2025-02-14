
import { useQuery } from "@tanstack/react-query";
import { getCurrentRepresentative, getRepresentativeCompanies } from "@/services/representativeService";
import { useAuth } from "@/contexts/AuthContext";

export function useRepresentative() {
  const { user } = useAuth();

  const { data: representative, isLoading: isLoadingRepresentative } = useQuery({
    queryKey: ['representative', user?.id],
    queryFn: getCurrentRepresentative,
    enabled: !!user && user.roles?.includes('representative'),
  });

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['representative-companies', representative?.id],
    queryFn: () => getRepresentativeCompanies(representative!.id),
    enabled: !!representative,
  });

  return {
    representative,
    companies,
    isLoading: isLoadingRepresentative || isLoadingCompanies,
  };
}
