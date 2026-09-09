import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FutureDeliveryDialogProps {
  open: boolean;
  productName: string;
  size: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const FutureDeliveryDialog = ({
  open,
  productName,
  size,
  onConfirm,
  onCancel,
}: FutureDeliveryDialogProps) => (
  <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tamanho indisponível no momento</AlertDialogTitle>
        <AlertDialogDescription>
          O tamanho <strong>{size}</strong> de <strong>{productName}</strong> não está
          disponível agora. Se você continuar, ele será registrado para{" "}
          <strong>entrega futura</strong>, assim que estivermos com o produto em estoque.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="text-onPrimary">
          Incluir para entrega futura
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
