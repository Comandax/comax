
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
import { Plus, Pencil, Trash2, ArrowUpDown, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

type SortField = 'name' | 'company' | 'email' | 'phone' | 'created_at';
type SortOrder = 'asc' | 'desc';

export function UserList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const { data: profilesData, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

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

  // Filtragem
  const filteredProfiles = profilesData?.filter(profile => {
    const searchTerm = search.toLowerCase();
    return (
      profile.fullName.toLowerCase().includes(searchTerm) ||
      profile.companyName.toLowerCase().includes(searchTerm) ||
      profile.email.toLowerCase().includes(searchTerm) ||
      (profile.phone && profile.phone.toLowerCase().includes(searchTerm))
    );
  }) || [];

  // Ordenação
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

  // Paginação
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuários</h2>
        <Button onClick={() => navigate('/users/create')}>
          <Plus className="size-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome, empresa, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
            icon={<Search className="size-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Itens por página:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-gray-50">
              Nome <ArrowUpDown className="inline size-4 ml-1" />
            </TableHead>
            <TableHead onClick={() => handleSort('company')} className="cursor-pointer hover:bg-gray-50">
              Empresa <ArrowUpDown className="inline size-4 ml-1" />
            </TableHead>
            <TableHead onClick={() => handleSort('email')} className="cursor-pointer hover:bg-gray-50">
              Email <ArrowUpDown className="inline size-4 ml-1" />
            </TableHead>
            <TableHead onClick={() => handleSort('phone')} className="cursor-pointer hover:bg-gray-50">
              Celular <ArrowUpDown className="inline size-4 ml-1" />
            </TableHead>
            <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer hover:bg-gray-50">
              Criado em <ArrowUpDown className="inline size-4 ml-1" />
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProfiles.map((profile) => (
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

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
