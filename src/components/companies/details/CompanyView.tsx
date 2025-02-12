
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/company";
import { Profile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";

interface CompanyViewProps {
  company: Company;
  onEditClick: () => void;
}

export function CompanyView({ company, onEditClick }: CompanyViewProps) {
  const [ownerProfile, setOwnerProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', company.owner_id)
        .single();

      if (!error && data) {
        setOwnerProfile(data);
      }
    };

    fetchOwnerProfile();
  }, [company.owner_id]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{company.name}</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {company.logo_url && (
          <div className="flex justify-center md:justify-start">
            <img
              src={company.logo_url}
              alt={`Logo ${company.name}`}
              className="w-24 h-24 object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          {ownerProfile && (
            <>
              <p><strong>Responsável:</strong> {ownerProfile.first_name} {ownerProfile.last_name}</p>
              <p><strong>E-mail:</strong> {ownerProfile.email}</p>
              {ownerProfile.phone && <p><strong>Telefone:</strong> {ownerProfile.phone}</p>}
            </>
          )}
          <p><strong>Status:</strong> {company.active ? "Ativo" : "Inativo"}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onEditClick}>
          Editar
        </Button>
      </div>
    </div>
  );
}
