
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { UserListHeader } from "./UserListHeader";
import { UserListControls } from "./UserListControls";
import { UserListTable } from "./UserListTable";
import { UserListPagination } from "./UserListPagination";
import { UserEditModal } from "./UserEditModal";
import { SortField, SortOrder } from "./types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UserList() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: profilesData, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*, companies(name)');

      if (user?.roles?.includes('representative')) {
        const { data: representative } = await supabase
          .from('representatives')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (representative) {
          query = query.eq('representative_id', representative.id);
        }
      }

      const { data: profiles, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('name, owner_id');

      if (companiesError) throw companiesError;

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

  const filteredProfiles = profilesData?.filter(profile => {
    const searchTerm = search.toLowerCase();
    return (
      profile.fullName.toLowerCase().includes(searchTerm) ||
      profile.companyName.toLowerCase().includes(searchTerm) ||
      profile.email?.toLowerCase().includes(searchTerm) ||
      (profile.phone && profile.phone.toLowerCase().includes(searchTerm))
    );
  }) || [];

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    let compareA, compareB;

    switch (sortField) {
      case 'name':
        compareA = a.fullName;
        compareB = b.fullName;
        break;
      case 'company':
        compareA = a.companyName;
        compareB = b.companyName;
        break;
      case 'email':
        compareA = a.email;
        compareB = b.email;
        break;
      case 'phone':
        compareA = a.phone || '';
        compareB = b.phone || '';
        break;
      case 'created_at':
        compareA = new Date(a.created_at).getTime();
        compareB = new Date(b.created_at).getTime();
        break;
      default:
        compareA = a.fullName;
        compareB = b.fullName;
    }

    if (sortOrder === 'asc') {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = sortedProfiles.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold text-primary">Usuários</h2>
          </div>
        </div>
        
        <UserListControls
          search={search}
          onSearchChange={setSearch}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />

        {search && filteredProfiles.length === 0 ? (
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nenhum usuário encontrado para o termo "{search}".
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <UserListTable
              profiles={currentProfiles}
              onSort={handleSort}
            />

            <UserListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <UserEditModal 
          isOpen={showEditModal}
          onOpenChange={setShowEditModal}
        />
      </CardContent>
    </Card>
  );
}
