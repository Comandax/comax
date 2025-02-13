import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowUpDown,
  Building2,
  Search,
  ShoppingBag,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Order } from "@/types/order";
import { useCompany } from "@/hooks/useCompany";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/index/LoadingState";

const OrderDetails = ({ order }: { order: Order }) => {
  return (
    <ScrollArea className="h-[80vh]">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Pedido</h3>
            <p>Código: {order._id}</p>
            <p>Data: {order.date}</p>
            <p>Hora: {order.time}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p>Nome: {order.customerName}</p>
            <p>Telefone: {order.customerPhone}</p>
            <p>Cidade: {order.customerCity}</p>
            <p>CEP: {order.customerZipCode}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Itens do pedido</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.productId}`} className="border rounded-lg overflow-hidden">
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
                    {item.sizes.map((size, index) => (
                      <TableRow key={`${item.productId}-${size.size}-${index}`}>
                        <TableCell>{size.size}</TableCell>
                        <TableCell>{size.quantity}</TableCell>
                        <TableCell className="text-right">
                          R$ {size.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right font-semibold">
            Total do pedido: R$ {order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
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
  
  const { company } = useCompany();
  const navigate = useNavigate();

  const { data: ordersData } = useQuery<OrdersQueryResult>({
    queryKey: ["orders", company?.id, searchTerm, sortConfig, currentPage, pageSize],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*", { count: 'exact' })
        .eq("company_id", company?.id);

      // Apply search filter if search term exists
      if (searchTerm) {
        query = query.ilike('customer_name', `%${searchTerm}%`);
      }

      // Apply sorting
      const column = sortConfig.column === 'customerName' ? 'customer_name' : 
                    sortConfig.column === 'date' ? 'date' : 'total';
      query = query.order(column, { ascending: sortConfig.direction === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

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
          customerZipCode: order.customer_zip_code,
          date: new Date(order.date).toLocaleDateString(),
          time: order.time,
          items: order.items,
          total: order.total,
          companyId: order.company_id,
        })),
        totalCount: count || 0,
      };
    },
    enabled: !!company?.id,
  });

  const totalPages = Math.ceil((ordersData?.totalCount || 0) / pageSize);

  const handleSort = (column: SortConfig['column']) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Se os dados ainda estão carregando
  if (!company || !ordersData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Se não houver empresa cadastrada
  if (!company) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-4">
            <Building2 className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-2xl font-semibold">Nenhuma empresa cadastrada</h2>
            <p className="text-muted-foreground">
              Para visualizar pedidos, você precisa primeiro cadastrar sua empresa.
            </p>
            <Button 
              onClick={() => navigate('/companies')}
              className="mt-4"
            >
              Cadastrar Empresa
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Se não houver pedidos
  if (ordersData?.orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para o painel
            </Button>
          </div>

          <Card 
            className="p-6 mb-8 bg-white/90 cursor-pointer hover:bg-white/95 transition-colors"
            onClick={() => navigate("/admin")}
          >
            <div className="flex items-center gap-4">
              {company.logo_url && (
                <img 
                  src={company.logo_url} 
                  alt={`Logo ${company.name}`}
                  className="w-16 h-16 object-contain rounded-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              </div>
            </div>
          </Card>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">Nenhum pedido realizado</h2>
              <p className="text-muted-foreground">
                Compartilhe o link da sua página para começar a receber pedidos.
              </p>
              <Button 
                onClick={() => navigate(`/${company.short_name}`)}
                className="mt-4"
              >
                Ver página de pedidos
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para o painel
          </Button>
        </div>

        <Card 
          className="p-6 mb-8 bg-white/90 cursor-pointer hover:bg-white/95 transition-colors"
          onClick={() => navigate("/admin")}
        >
          <div className="flex items-center gap-4">
            {company.logo_url && (
              <img 
                src={company.logo_url} 
                alt={`Logo ${company.name}`}
                className="w-16 h-16 object-contain rounded-lg"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-3xl font-bold">Relatório de Pedidos</h1>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Itens por página" />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} itens
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('customerName')}
                  className="hover:bg-transparent"
                >
                  Cliente
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('date')}
                  className="hover:bg-transparent"
                >
                  Data
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('total')}
                  className="hover:bg-transparent"
                >
                  Total
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData?.orders.map((order) => (
              <TableRow
                key={order._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedOrder(order)}
              >
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-right">
                  R$ {order.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                >
                  Anterior
                </PaginationPrevious>
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                >
                  Próximo
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
