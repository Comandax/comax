
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  productsCount: number;
  ordersCount: number;
}

export function StatsCards({ productsCount, ordersCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="p-6 bg-white border-2 border-primary/20 shadow-lg rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Produtos</h3>
        <div className="text-2xl font-bold text-foreground/90">
          {productsCount}
        </div>
      </div>
      <div className="p-6 bg-white border-2 border-primary/20 shadow-lg rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Pedidos</h3>
        <div className="text-2xl font-bold text-foreground/90">
          {ordersCount}
        </div>
      </div>
    </div>
  );
}
