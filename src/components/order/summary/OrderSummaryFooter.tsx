
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryFooterProps {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export const OrderSummaryFooter = ({ onSubmit, isSubmitting }: OrderSummaryFooterProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSubmit} 
        size="lg" 
        disabled={isSubmitting}
        className="flex items-center gap-2 w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Enviando pedido
          </>
        ) : (
          "Enviar Pedido"
        )}
      </Button>
    </div>
  );
};
