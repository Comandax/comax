import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { User, Building2, LogOut, ArrowLeft, ArrowUpDown, ArrowUp, ArrowDown, Copy, ExternalLink, Search, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingState } from "@/components/index/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import type { Order } from "@/types/order";
import { useCompany } from "@/hooks/useCompany";

const OrderDetails = ({
  order
}: {
  order: Order;
}) => {
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatZipCode = (zipCode: string) => {
    const cleaned = zipCode.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return zipCode;
  };

  return <ScrollArea className="h-[80vh]">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Pedido</h3>
            <p>Código: {order._id}</p>
            <p>Data: {order.date}</p>
            <p>Hora: {order.time}</p>
            {order.notes && (
              <div className="mt-2">
                <h4 className="font-semibold mb-1">Observações:</h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p>Nome: {order.customerName}</p>
            <p>Telefone: {formatPhoneNumber(order.customerPhone)}</p>
            <p>Cidade: {order.customerCity} / {order.customerState}</p>
            <p>CEP: {formatZipCode(order.customerZipCode)}</p>
          </div>
        </div>

        <div className="pr-[10px]">
          <h3 className="font-semibold mb-4">Itens do pedido</h3>
          <div className="space-y-4">
            {order.items.map(item => <div key={`${item.productId}`} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 font-semibold">
                  {item.reference} - {item.name}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.sizes.map((size, index) => <TableRow key={`${item.productId}-${size.size}-${index}`}>
                        <TableCell>{size.size}</TableCell>
                        <TableCell>{size.quantity}</TableCell>
                        <TableCell className="text-right">
                          R$ {size.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>)}
          </div>
          <div className="mt-4 text-right font-semibold pr-[20px]">
            Total do pedido: R$ {order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </ScrollArea>;
};

type SortConfig = {
  column: 'customerName' | 'date' | 'total';
  direction: 'asc' | 'desc';
};

type OrdersQueryResult = {
  orders: Order[];
  totalCount: number;
};

const PAGE_SIZES = [10, 20, 50, 100];

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'desc'
  });

  const {
    company
  } = useCompany();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    user,
    logout
  } = useAuth();
  const {
    data: userProfile
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você será redirecionado para a página de login."
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente."
      });
    }
  };

  const userInitials = userProfile ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase() : 'U';
  const userName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Usuário';

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${company?.short_name}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para sua área de transferência."
    });
  };

  const handleOpenLink = () => {
    window.open(`/${company?.short_name}`, '_blank');
  };

  const {
    data: ordersData
  } = useQuery({
    queryKey: ["orders", company?.id],
    queryFn: async () => {
      let query = supabase.from("orders").select("*", {
        count: 'exact'
      }).eq("company_id", company?.id);
      const column = sortConfig.column === 'customerName' ? 'customer_name' : sortConfig.column === 'date' ? 'date' : 'total';
      query = query.order(column, {
        ascending: sortConfig.direction === 'asc'
      });
      const {
        data,
        error,
        count
      } = await query;
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      return {
        orders: data.map((order: any) => ({
          _id: order.id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerCity: order.customer_city,
          customerState: order.customer_state,
          customerZipCode: order.customer_zip_code,
          date: new Date(order.date).toLocaleDateString(),
          time: order.time,
          items: order.items,
          total: order.total,
          companyId: order.company_id
        })),
        totalCount: count || 0
      };
    },
    enabled: !!company?.id
  });

  const filteredOrders = useMemo(() => {
    if (!ordersData?.orders) return [];
    return ordersData.orders.filter(order => order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [ordersData?.orders, searchTerm]);

  const handleSort = (column: SortConfig['column']) => {
    setSortConfig(prevConfig => ({
      column,
      direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedOrders = useMemo(() => {
    if (!filteredOrders) return [];
    return [...filteredOrders].sort((a, b) => {
      let compareA: string | number = '';
      let compareB: string | number = '';
      switch (sortConfig.column) {
        case 'customerName':
          compareA = a.customerName.toLowerCase();
          compareB = b.customerName.toLowerCase();
          break;
        case 'date':
          compareA = new Date(`${a.date} ${a.time}`).getTime();
          compareB = new Date(`${b.date} ${b.time}`).getTime();
          break;
        case 'total':
          compareA = a.total;
          compareB = b.total;
          break;
      }
      if (sortConfig.direction === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  }, [filteredOrders, sortConfig]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedOrders.slice(start, end);
  }, [sortedOrders, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  if (!company || !ordersData) {
    return <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <LoadingState />
        </div>
      </div>;
  }

  const hasNoOrders = ordersData.orders.length === 0;

  const SortIcon = ({
    column
  }: {
    column: SortConfig['column'];
  }) => {
    if (column !== sortConfig.column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-white hover:text-white/80">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <img src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" alt="COMAX Logo" className="h-8 w-auto cursor-pointer" onClick={() => navigate('/admin')} />
                </div>
                <h1 className="text-xl font-semibold text-white">Pedidos</h1>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem disabled className="font-semibold">
                    {userName}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/companies')}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Minha Empresa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {company && <div className="bg-white/5 border-b border-white/10">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center gap-4 py-2">
                {company.logo_url && <img src={company.logo_url} alt={`Logo ${company.name}`} className="w-8 h-8 object-contain rounded" />}
                <h2 className="text-sm font-medium text-white/90">{company.name}</h2>
              </div>
            </div>
          </div>
        </div>}

      <div className="container mx-auto py-10">
        <div className="max-w-6xl mx-auto px-4">
          {!hasNoOrders && <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input placeholder="Buscar por cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full md:w-64" />
                </div>
                <Select value={pageSize.toString()} onValueChange={value => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Itens por página" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map(size => <SelectItem key={size} value={size.toString()}>
                        {size} itens
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>}

          {hasNoOrders ? <Card className="p-8 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">Nenhum pedido realizado</h2>
              <p className="text-muted-foreground">
                Compartilhe o link da sua página para começar a receber pedidos.
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Página de pedidos:</p>
                <code className="text-sm">
                  {window.location.origin}/{company?.short_name}
                </code>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex flex-col items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Copiar</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleOpenLink}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Abrir</span>
                  </div>
                </div>
              </div>
            </Card> : filteredOrders.length === 0 ? <Card className="p-8 text-center space-y-4">
              <Search className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">Nenhum resultado encontrado</h2>
              <p className="text-muted-foreground">
                Sua busca não retornou resultados. Tente outros termos.
              </p>
            </Card> : <div className="bg-gray-50/95 rounded-lg p-6 shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100/80 hover:bg-gray-100/90">
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('customerName')} className="hover:bg-transparent font-semibold">
                        Cliente
                        <SortIcon column="customerName" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('date')} className="hover:bg-transparent font-semibold">
                        Data/Hora
                        <SortIcon column="date" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => handleSort('total')} className="hover:bg-transparent font-semibold ml-auto">
                        Total
                        <SortIcon column="total" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => <TableRow key={order._id} className={`cursor-pointer hover:bg-gray-100/70 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}`} onClick={() => setSelectedOrder(order)}>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        {order.date} às {order.time.substring(0, 5)}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {order.total.toFixed(2)}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>

              {totalPages > 1 && <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                      </PaginationItem>
                      {Array.from({
                  length: totalPages
                }).map((_, i) => <PaginationItem key={i}>
                          <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>)}
                      <PaginationItem>
                        <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>}
            </div>}

          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-4xl">
              {selectedOrder && <OrderDetails order={selectedOrder} />}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>;
};

export default Orders;
