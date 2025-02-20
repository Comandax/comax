
import { Settings2, ShoppingBag, ListCheck, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@/types/order";
import { OrderSummaryModal } from "@/components/order/OrderSummaryModal";
import { useState } from "react";

interface CompanyInfoProps {
  company: Pick<Company, 'name' | 'logo_url'>;
  total: number;
  items: OrderItem[];
  onSubmitOrder: (notes: string) => Promise<void> | void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveItem?: (productId: string, size: string) => void;
  isCalculating?: boolean;
}

export const CompanyInfo = ({ 
  company,
  total,
  items,
  onSubmitOrder,
  isOpen,
  onOpenChange,
  onRemoveItem,
  isCalculating = false
}: CompanyInfoProps) => {
  const navigate = useNavigate();
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleOpenModal = () => {
    setIsModalLoading(true);
    setTimeout(() => {
      onOpenChange(true);
      setIsModalLoading(false);
    }, 500);
  };

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white/95 shadow-md z-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                {company.logo_url && (
                  <img 
                    src={company.logo_url} 
                    alt={`${company.name} logo`}
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                )}
                <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
              </div>

              <div className="flex items-center gap-4">
                {total > 0 && (
                  <div className="flex items-center gap-4 bg-tertiary text-white p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      <div>
                        <div className="text-sm font-medium">Total do Pedido</div>
                        <div className="text-2xl font-bold tracking-tight">
                          {isCalculating ? (
                            <div className="flex items-center gap-2">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Calculando...</span>
                            </div>
                          ) : (
                            formattedTotal
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      className="bg-white hover:bg-white/90 text-tertiary font-medium h-auto py-2"
                      onClick={handleOpenModal}
                      disabled={isModalLoading || isCalculating}
                    >
                      {isModalLoading ? (
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ListCheck className="w-4 h-4 mr-2" />
                      )}
                      <span>{isModalLoading ? "Carregando..." : "Ver produtos selecionados"}</span>
                    </Button>
                  </div>
                )}
                <button
                  onClick={() => navigate("/admin")}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Painel Administrativo"
                >
                  <Settings2 size={24} />
                </button>
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
