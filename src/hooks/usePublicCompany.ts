
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Company } from "@/types/company";

export const usePublicCompany = (companyId: string | undefined) => {
  const [publicCompany, setPublicCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicCompany = async (id: string) => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        return null;
      }
      return data;
    };

    if (companyId) {
      fetchPublicCompany(companyId).then((data) => {
        setPublicCompany(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [companyId]);

  return { publicCompany, isLoading };
};
