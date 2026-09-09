
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { UseFieldArrayReturn, UseFormReturn, useWatch } from "react-hook-form";
import { ProductFormData } from "@/types/product";
import { isSizeAvailable } from "@/lib/availability";
import { ZeroValueDialog } from "./ZeroValueDialog";

interface ProductSizesProps {
  form: UseFormReturn<ProductFormData>;
  sizeArray: UseFieldArrayReturn<ProductFormData, "sizes">;
}

interface SizeRowProps {
  form: UseFormReturn<ProductFormData>;
  index: number;
  onRemove: () => void;
}

function SizeRow({ form, index, onRemove }: SizeRowProps) {
  const available = useWatch({
    control: form.control,
    name: `sizes.${index}.available`,
  });
  const isAvailable = isSizeAvailable({ available });

  const [isConfirmingZero, setIsConfirmingZero] = useState(false);
  // Valor ao entrar no campo, restaurado se o usuário cancelar a confirmação.
  const valueOnFocus = useRef<number | undefined>(undefined);
  // Um zero já confirmado não volta a perguntar enquanto continuar zero.
  const zeroConfirmed = useRef(false);

  const sizeLabel = form.getValues(`sizes.${index}.size`) || `#${index + 1}`;

  const handleValueFocus = () => {
    valueOnFocus.current = form.getValues(`sizes.${index}.value`);
  };

  // A confirmação é pedida ao sair do campo, não a cada tecla: durante a digitação
  // o valor passa por zero o tempo todo.
  const handleValueBlur = () => {
    const current = form.getValues(`sizes.${index}.value`);

    if (current !== 0) {
      // Saiu do zero: uma futura volta a zero deve perguntar de novo.
      zeroConfirmed.current = false;
      return;
    }

    if (!zeroConfirmed.current) {
      setIsConfirmingZero(true);
    }
  };

  const confirmZero = () => {
    zeroConfirmed.current = true;
    setIsConfirmingZero(false);
  };

  const cancelZero = () => {
    // Sem valor anterior utilizável (linha nova ou já zerada), esvazia para o usuário digitar.
    const restored = valueOnFocus.current;
    form.setValue(
      `sizes.${index}.value`,
      restored === undefined || restored === 0 ? undefined : restored,
      { shouldValidate: true }
    );
    zeroConfirmed.current = false;
    setIsConfirmingZero(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-start border-b sm:border-b-0 pb-3 sm:pb-0">
      <div className={`flex gap-4 flex-1 ${isAvailable ? "" : "opacity-60"}`}>
        <FormField
          control={form.control}
          name={`sizes.${index}.size`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input {...field} placeholder="Tamanho (P, M, G, etc)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`sizes.${index}.value`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Valor"
                  onFocus={handleValueFocus}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    field.onChange(Number.isNaN(parsed) ? undefined : parsed);
                  }}
                  onBlur={() => {
                    field.onBlur();
                    handleValueBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <FormField
          control={form.control}
          name={`sizes.${index}.available`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0 sm:w-[150px]">
              <FormControl>
                <Switch
                  checked={isSizeAvailable({ available: field.value })}
                  onCheckedChange={field.onChange}
                  aria-label="Disponibilidade do tamanho"
                />
              </FormControl>
              <FormLabel className="text-xs font-normal cursor-pointer whitespace-nowrap">
                {isAvailable ? "Disponível" : "Entrega futura"}
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ZeroValueDialog
        open={isConfirmingZero}
        sizeLabel={sizeLabel}
        onConfirm={confirmZero}
        onCancel={cancelZero}
      />
    </div>
  );
}

export function ProductSizes({ form, sizeArray }: ProductSizesProps) {
  const { fields, append, remove } = sizeArray;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-2">
        <FormLabel className="text-foreground font-medium">Tamanhos e Valores</FormLabel>
        <Button
          type="button"
          variant="default"
          size="sm"
          // Nasce sem valor (não zero), para que digitar 0 seja uma escolha explícita
          // e a confirmação dispare.
          onClick={() => append({ size: "", value: undefined, available: true })}
          className="bg-primary text-onPrimary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tamanho
        </Button>
      </div>

      {fields.map((field, index) => (
        <SizeRow
          key={field.id}
          form={form}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  );
}
