
import { ShoppingBag, ListCheck, Loader } from "lucide-react";
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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FloatingTotal = ({ 
  total,
  items,
  notes,
  onNotesChange,
  onSubmitOrder,
  isOpen,
  onOpenChange
}: FloatingTotalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    setIsLoading(true);
    // Simular um pequeno delay antes de abrir o modal
    setTimeout(() => {
      onOpenChange(true);
      setIsLoading(false);
    }, 500);
  };

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
            className="w-full flex items-center gap-2 bg-white hover:bg-white/90 text-[#8B5CF6] font-medium"
            onClick={handleOpenModal}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ListCheck className="w-4 h-4" />
            )}
            {isLoading ? "Carregando..." : "Ver produtos selecionados"}
          </Button>
        </div>
      </div>

      <OrderSummaryModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        items={items}
        total={total}
        notes={notes}
        onNotesChange={onNotesChange}
        onSubmit={async () => {
          return new Promise<void>((resolve) => {
            onSubmitOrder();
            resolve();
          });
        }}
      />
    </>
  );
};
