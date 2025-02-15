
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
import { Plus, ArrowUpDown } from "lucide-react";
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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

type SortField = 'name' | 'company' | 'email' | 'phone' | 'created_at';
type SortOrder = 'asc' | 'desc';

export function UserList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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
          {user?.roles?.includes('superuser') && (
            <Button onClick={() => navigate('/users/create')} className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="size-4 mr-2" />
              Novo Usuário
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome, empresa, email ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm bg-white/80 border-primary/30 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Itens por página:</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 border-primary/30 focus:border-primary bg-white/80">
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

        <div className="bg-white/80 rounded-lg border border-primary/30">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/15 hover:bg-primary/20">
                <TableHead 
                  onClick={() => handleSort('name')} 
                  className="cursor-pointer text-primary-foreground font-semibold"
                >
                  Nome <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
                <TableHead 
                  onClick={() => handleSort('company')} 
                  className="cursor-pointer text-primary-foreground font-semibold"
                >
                  Empresa <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
                <TableHead 
                  onClick={() => handleSort('email')} 
                  className="cursor-pointer text-primary-foreground font-semibold"
                >
                  Email <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
                <TableHead 
                  onClick={() => handleSort('phone')} 
                  className="cursor-pointer text-primary-foreground font-semibold"
                >
                  Celular <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
                <TableHead 
                  onClick={() => handleSort('created_at')} 
                  className="cursor-pointer text-primary-foreground font-semibold"
                >
                  Criado em <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProfiles.map((profile, index) => (
                <TableRow 
                  key={profile.id} 
                  className={`
                    transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-primary/5'}
                    hover:bg-primary/10
                  `}
                >
                  <TableCell className="font-medium">{profile.fullName}</TableCell>
                  <TableCell>{profile.companyName}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.phone}</TableCell>
                  <TableCell>
                    {format(new Date(profile.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-primary/30 hover:bg-primary/10 text-primary"
                >
                  Anterior
                </Button>
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page 
                      ? "bg-primary text-white hover:bg-primary/90" 
                      : "border-primary/30 hover:bg-primary/10 text-primary"
                    }
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-primary/30 hover:bg-primary/10 text-primary"
                >
                  Próximo
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
