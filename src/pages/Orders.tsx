import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Copy, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/index/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import type { Order } from "@/types/order";
import { useCompany } from "@/hooks/useCompany";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderDetails } from "@/components/orders/OrderDetails";

type SortConfig = {
  column: 'customerName' | 'date' | 'total';
  direction: 'asc' | 'desc';
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

  const { company } = useCompany();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
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

  const { data: ordersData } = useQuery({
    queryKey: ["orders", company?.id],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*", { count: 'exact' })
        .eq("company_id", company?.id);
      
      const column = sortConfig.column === 'customerName' ? 'customer_name' : 
                    sortConfig.column === 'date' ? 'date' : 'total';
      
      query = query.order(column, { ascending: sortConfig.direction === 'asc' });
      
      const { data, error, count } = await query;
      
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
          companyId: order.company_id,
          notes: order.notes
        })),
        totalCount: count || 0
      };
    },
    enabled: !!company?.id
  });

  const filteredOrders = useMemo(() => {
    if (!ordersData?.orders) return [];
    return ordersData.orders.filter(order => 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  const hasNoOrders = ordersData.orders.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <OrdersHeader 
        userProfile={userProfile}
        company={company}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg overflow-hidden border">
          {!hasNoOrders && (
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar por cliente..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-64"
                    />
                  </div>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={value => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full md:w-32">
                      <SelectValue placeholder="Itens por página" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZES.map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} itens
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <OrdersTable
                orders={paginatedOrders}
                sortConfig={sortConfig}
                onSort={handleSort}
                onOrderClick={setSelectedOrder}
              />

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}

          {hasNoOrders && (
            <Card className="p-8 text-center space-y-4 bg-white border-blue-100">
              <ShoppingBag className="w-12 h-12 mx-auto text-blue-500" />
              <h2 className="text-2xl font-semibold text-blue-900">Nenhum pedido realizado</h2>
              <p className="text-blue-600">
                Compartilhe o link da sua página para começar a receber pedidos.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 mb-2">Página de pedidos:</p>
                <code className="text-sm text-blue-700">
                  {window.location.origin}/{company?.short_name}
                </code>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex flex-col items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleCopyLink} className="border-blue-200 hover:bg-blue-50">
                      <Copy className="h-4 w-4 text-blue-500" />
                    </Button>
                    <span className="text-xs text-blue-600">Copiar</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleOpenLink} className="border-blue-200 hover:bg-blue-50">
                      <ExternalLink className="h-4 w-4 text-blue-500" />
                    </Button>
                    <span className="text-xs text-blue-600">Abrir</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl">
            {selectedOrder && <OrderDetails order={selectedOrder} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Orders;
