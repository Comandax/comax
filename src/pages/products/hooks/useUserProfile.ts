
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserProfile() {
  const { user } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const userInitials = userProfile ? 
    `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase() : 
    'U';

  const userName = userProfile ? 
    `${userProfile.first_name} ${userProfile.last_name}` : 
    'Usuário';

  return { userProfile, userInitials, userName };
}
