
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OrderNotesProps {
  value: string;
  onChange: (value: string) => void;
}

export const OrderNotes = ({ value, onChange }: OrderNotesProps) => {
  return (
    <div className="space-y-2 bg-white/90 p-6 rounded-lg shadow-md">
      <Label htmlFor="notes">Observações sobre seu pedido</Label>
      <Textarea
        id="notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
        placeholder="Caso precise, coloque aqui as observações sobre seu pedido."
      />
    </div>
  );
};
