
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface RepresentativeName {
  first_name: string;
  last_name: string;
}

export function useRepresentative(identifier: string | undefined) {
  const [representativeId, setRepresentativeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [representativeName, setRepresentativeName] = useState<RepresentativeName | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRepresentative = async () => {
      if (!identifier) {
        setError("Link de indicação inválido. Por favor, verifique o link e tente novamente.");
        setLoading(false);
        return;
      }

      console.log("Buscando representante com identificador:", identifier);

      try {
        const { data: allReps, error: listError } = await supabase
          .from('representatives')
          .select('identifier');
        
        console.log("Todos os identificadores de representantes:", allReps);

        const { data: representative, error: repError } = await supabase
          .from('representatives')
          .select()
          .eq('identifier', identifier.toLowerCase())
          .maybeSingle();

        console.log("Resultado da busca do representante:", { representative, repError });

        if (repError) {
          console.error("Erro ao buscar representante:", repError);
          throw new Error("Erro ao verificar o link de indicação.");
        }

        if (!representative) {
          throw new Error("Representante não encontrado. Verifique o link de indicação.");
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select()
          .eq('id', representative.profile_id)
          .maybeSingle();

        console.log("Resultado da busca do perfil:", { profile, profileError });

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          throw new Error("Erro ao verificar o link de indicação.");
        }

        if (!profile) {
          throw new Error("Perfil do representante não encontrado.");
        }

        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select()
          .eq('user_id', representative.profile_id)
          .eq('role', 'representative');

        console.log("Resultado da busca de roles:", { userRoles, rolesError });

        if (rolesError) {
          console.error("Erro ao verificar roles:", rolesError);
          throw new Error("Erro ao verificar o link de indicação.");
        }

        if (!userRoles || userRoles.length === 0) {
          throw new Error("Link de indicação inválido ou expirado.");
        }

        setRepresentativeId(representative.id);
        setRepresentativeName({ first_name: profile.first_name, last_name: profile.last_name });
        
        toast({
          title: "Representante identificado",
          description: `Você está se cadastrando através da indicação de ${profile.first_name} ${profile.last_name}.`,
        });
      } catch (err: any) {
        console.error("Erro detalhado:", err);
        setError(err.message || "Erro ao verificar o link de indicação. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepresentative();
  }, [identifier, toast]);

  return { representativeId, loading, error, representativeName };
}
