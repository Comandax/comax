
import { useQuery } from "@tanstack/react-query";
import { getProfiles } from "@/services/profileService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function UserList() {
  const navigate = useNavigate();
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Primeiro, busca os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Depois, busca as empresas para cada perfil
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('name, owner_id');

      if (companiesError) throw companiesError;

      // Mapeia os perfis com as informações das empresas
      return profiles.map(profile => {
        const company = companies.find(company => company.owner_id === profile.id);
        return {
          ...profile,
          companyName: company?.name || "Empresa não cadastrada",
          fullName: `${profile.first_name} ${profile.last_name}`,
        };
      });
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuários</h2>
        <Button onClick={() => navigate('/users/create')}>
          <Plus className="size-4" />
          Novo Usuário
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Celular</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles?.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.fullName}</TableCell>
              <TableCell>{profile.companyName}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.phone}</TableCell>
              <TableCell>
                {format(new Date(profile.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/users/${profile.id}`)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
