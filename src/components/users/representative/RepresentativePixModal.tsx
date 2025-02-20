
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RepresentativePixModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pixKey: string;
  onPixKeyChange: (value: string) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
  hasExistingKey: boolean;
}

export function RepresentativePixModal({
  isOpen,
  onOpenChange,
  pixKey,
  onPixKeyChange,
  onSave,
  isLoading,
  hasExistingKey,
}: RepresentativePixModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {hasExistingKey ? "Editar Chave PIX" : "Cadastrar Chave PIX"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={pixKey}
            onChange={(e) => onPixKeyChange(e.target.value)}
            placeholder="Digite sua chave PIX"
            className="w-full border-primary/20"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Esta chave PIX será usada para receber suas comissões.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-onPrimary"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
