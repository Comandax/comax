
import { ShoppingBag, ListCheck, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSummaryModal } from "@/components/order/OrderSummaryModal";
import { useState, useEffect } from "react";
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
  const [showTotal, setShowTotal] = useState(false);

  useEffect(() => {
    if (total > 0) {
      setShowTotal(true);
    } else {
      setShowTotal(false);
    }
  }, [total]);

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
      <div className="fixed top-0 right-0 z-[9999] p-4 flex flex-col gap-4">
        {/* Primeira caixa - Roxa */}
        <div 
          className={`bg-[#8B5CF6] shadow-lg rounded-lg p-4 text-white transition-all duration-300 transform ${
            showTotal ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
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
            className="w-full flex items-center gap-2 bg-white hover:bg-white/90 text-[#8B5CF6] font-medium mt-4"
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

        {/* Segunda caixa - Terciária */}
        <div 
          className={`bg-[#6E59A5] shadow-lg rounded-lg p-4 text-white transition-all duration-300 transform ${
            showTotal ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <div>
              <div className="text-lg font-semibold">Total Calculado</div>
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
