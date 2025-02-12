
import { ShoppingBag } from "lucide-react";

interface FloatingTotalProps {
  total: number;
}

export const FloatingTotal = ({ total }: FloatingTotalProps) => {
  if (total <= 0) return null;

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  return (
    <div className="fixed top-4 right-4 bg-[#8B5CF6] shadow-lg rounded-lg p-4 animate-float-in text-white">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" />
        <div>
          <div className="text-lg font-semibold">Total do Pedido</div>
          <div className="text-2xl font-bold">
            {formattedTotal}
          </div>
        </div>
      </div>
    </div>
  );
};
