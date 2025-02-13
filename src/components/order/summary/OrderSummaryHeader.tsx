
import { FileText } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const OrderSummaryHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Resumo do Pedido
      </DialogTitle>
    </DialogHeader>
  );
};
