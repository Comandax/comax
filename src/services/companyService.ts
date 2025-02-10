
import { supabase } from "@/integrations/supabase/client";

export const getCompanyBySlug = async (companySlug: string) => {
  const { data: companies, error: companyError } = await supabase
    .from('companies')
    .select('id, name')
    .eq('active', true)
    .ilike('name', companySlug.replace(/-/g, ' '))
    .maybeSingle();

  if (companyError) {
    throw companyError;
  }

  return companies;
};

