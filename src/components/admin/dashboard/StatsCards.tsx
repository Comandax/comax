
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  productsCount: number;
  ordersCount: number;
}

export function StatsCards({ productsCount, ordersCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 hover:border-primary/20 transition-colors">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Produtos</h3>
        <div className="text-2xl font-bold text-foreground/90">
          {productsCount}
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 hover:border-primary/20 transition-colors">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Pedidos</h3>
        <div className="text-2xl font-bold text-foreground/90">
          {ordersCount}
        </div>
      </div>
    </div>
  );
}
