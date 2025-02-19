
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/types/order";

interface RecentOrdersCardProps {
  orders: Order[];
  isLoading: boolean;
}

export const RecentOrdersCard = ({ orders, isLoading }: RecentOrdersCardProps) => {
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
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
      <CardContent className="p-6 space-y-6 relative">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pedidos Recentes
          </h2>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Carregando pedidos...
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-grow max-w-[60%]">
                      <div className="min-w-[120px] shrink-0">
                        <p className="text-sm font-medium text-gray-500">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {order.customerName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {order.customerCity} / {order.customerState}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 ml-auto">
                      <p className="font-medium text-primary order-2 sm:order-1">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-sm text-gray-500 order-1 sm:order-2">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                asChild
                className="w-full"
                variant="outline"
              >
                <Link to="/orders" className="flex items-center justify-center gap-2">
                  <span>Ver todos os pedidos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum pedido encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
