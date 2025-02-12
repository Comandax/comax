
import { ShoppingBag, ListCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSummaryModal } from "@/components/order/OrderSummaryModal";
import { useState } from "react";
import type { OrderItem } from "@/types/order";

interface FloatingTotalProps {
  total: number;
  items: OrderItem[];
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmitOrder: () => void;
}

export const FloatingTotal = ({ 
  total,
  items,
  notes,
  onNotesChange,
  onSubmitOrder
}: FloatingTotalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (total <= 0) return null;

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  return (
    <>
      <div className="fixed top-4 right-4 bg-[#8B5CF6] shadow-lg rounded-lg p-4 animate-float-in text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <div>
              <div className="text-lg font-semibold">Total do Pedido</div>
              <div className="text-2xl font-bold">
                {formattedTotal}
              </div>
            </div>
          </div>
          
          <Button 
            variant="secondary" 
            className="w-full flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <ListCheck className="w-4 h-4" />
            Ver produtos selecionados
          </Button>
        </div>
      </div>

      <OrderSummaryModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        items={items}
        total={total}
        notes={notes}
        onNotesChange={onNotesChange}
        onSubmit={() => {
          setIsModalOpen(false);
          onSubmitOrder();
        }}
      />
    </>
  );
};
