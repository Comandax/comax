import { ArrowRight, ListStart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { OrderDetails } from "@/components/orders/OrderDetails";
import type { Order } from "@/types/order";
import { useState } from "react";

interface RecentOrdersCardProps {
  orders: Order[];
  isLoading: boolean;
}

export const RecentOrdersCard = ({ orders, isLoading }: RecentOrdersCardProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <Card className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 hover:border-primary/20 transition-colors">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <ListStart className="h-5 w-5" />
            <h2 className="text-lg font-semibold text-onSurfaceVariant">
              Pedidos Recentes
            </h2>
          </div>

          <div className="flex-1 flex flex-col">
            {isLoading ? (
              <div className="text-center py-8 text-onSurfaceVariant/60">
                Carregando pedidos...
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order._id} 
                      className="p-4 rounded-lg border border-gray-200 bg-surface hover:border-primary/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-grow max-w-[60%]">
                          <div className="min-w-[120px] shrink-0">
                            <p className="text-sm font-medium text-onSurfaceVariant/60">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-onSurface truncate">
                              {order.customerName}
                            </h3>
                            <p className="text-sm text-onSurfaceVariant/60 mt-1 truncate">
                              {order.customerCity} / {order.customerState}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 ml-auto">
                          <p className="font-medium text-primary order-2 sm:order-1">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-sm text-onSurfaceVariant/60 order-1 sm:order-2">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className="w-full mt-auto"
                  variant="outline"
                >
                  <Link to="/orders" className="flex items-center justify-center gap-2">
                    <span>Ver todos os pedidos</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surfaceContainer rounded-lg">
                <div className="text-onSurfaceVariant/60 mb-2">
                  Nenhum pedido realizado
                </div>
                <p className="text-sm text-onSurfaceVariant/60 max-w-[300px]">
                  Os pedidos realizados através do link público aparecerão aqui.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>
              Informações completas sobre o pedido, incluindo dados do cliente e itens solicitados.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
