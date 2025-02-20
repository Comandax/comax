
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RepresentativeIdentifierModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  identifier: string;
  onIdentifierChange: (value: string) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function RepresentativeIdentifierModal({
  isOpen,
  onOpenChange,
  identifier,
  onIdentifierChange,
  onSave,
  isLoading,
}: RepresentativeIdentifierModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Editar Identificador
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            placeholder="Digite seu identificador"
            className="w-full border-primary/20"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Este identificador será usado no seu link de indicação.
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
