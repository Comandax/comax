import { useRef } from "react";
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

interface ZeroValueDialogProps {
  open: boolean;
  sizeLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Zero é um preço válido (brinde, cortesia), mas incomum o bastante para confirmar. */
export const ZeroValueDialog = ({
  open,
  sizeLabel,
  onConfirm,
  onCancel,
}: ZeroValueDialogProps) => {
  // AlertDialogAction fecha o diálogo, o que dispara onOpenChange(false). Sem esta
  // marca, o fechamento por confirmação seria tratado como cancelamento e desfaria
  // o valor que o usuário acabou de confirmar.
  const confirming = useRef(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) return;
    if (confirming.current) {
      confirming.current = false;
      return;
    }
    onCancel();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar valor zero</AlertDialogTitle>
          <AlertDialogDescription>
            Você definiu o valor do tamanho <strong>{sizeLabel}</strong> como{" "}
            <strong>R$ 0,00</strong>. Deseja confirmar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              confirming.current = true;
              onConfirm();
            }}
            className="text-onPrimary"
          >
            Confirmar valor zero
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
