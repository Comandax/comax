
import { Button } from "@/components/ui/button";
import { ListCheck, Loader } from "lucide-react";

interface OrderSummaryButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const OrderSummaryButton = ({ onClick, isLoading }: OrderSummaryButtonProps) => {
  return (
    <Button 
      variant="secondary" 
      className="flex items-center gap-2 bg-white hover:bg-white/90 text-[#8B5CF6] font-medium"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <ListCheck className="w-4 h-4" />
      )}
      {isLoading ? "Carregando..." : "Para finalizar, confira o resumo do pedido"}
    </Button>
  );
};
