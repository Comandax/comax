
import { ShoppingBag, ListCheck, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSummaryModal } from "@/components/order/OrderSummaryModal";
import { useState } from "react";
import type { OrderItem } from "@/types/order";

interface FloatingTotalProps {
  total: number;
  items: OrderItem[];
  onSubmitOrder: (notes: string) => Promise<void> | void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveItem?: (productId: string, size: string) => void;
  isCalculating?: boolean;
}

export const FloatingTotal = ({ 
  total,
  items,
  onSubmitOrder,
  isOpen,
  onOpenChange,
  onRemoveItem,
  isCalculating = false
}: FloatingTotalProps) => {
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleOpenModal = () => {
    setIsModalLoading(true);
    setTimeout(() => {
      onOpenChange(true);
      setIsModalLoading(false);
    }, 500);
  };

  if (total <= 0) return null;

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  return (
    <>
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }} className="bg-[#8B5CF6] shadow-lg rounded-lg p-4 text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <div>
              <div className="text-lg font-semibold">Total do Pedido</div>
              <div className="text-2xl font-bold">
                {isCalculating ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Calculando...
                  </div>
                ) : (
                  formattedTotal
                )}
              </div>
            </div>
          </div>
          
          <Button 
            variant="secondary" 
            className="w-full flex items-center gap-2 bg-white hover:bg-white/90 text-[#8B5CF6] font-medium"
            onClick={handleOpenModal}
            disabled={isModalLoading || isCalculating}
          >
            {isModalLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ListCheck className="w-4 h-4" />
            )}
            {isModalLoading ? "Carregando..." : "Ver produtos selecionados"}
          </Button>
        </div>
      </div>

      <OrderSummaryModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        items={items}
        total={total}
        notes={notes}
        onNotesChange={setNotes}
        onSubmit={async () => {
          await onSubmitOrder(notes);
        }}
        onRemoveItem={onRemoveItem}
      />
    </>
  );
};
