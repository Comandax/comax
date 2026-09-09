
import { isSizeAvailable } from "@/lib/availability";
import type { ProductSize } from "@/types/product";

interface ProductSizesProps {
  sizes: ProductSize[];
}

export function ProductSizes({ sizes }: ProductSizesProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Tamanhos e Valores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sizes.map((size, index) => {
          const available = isSizeAvailable(size);

          return (
            <div
              key={index}
              className={`flex flex-col gap-1 p-2 rounded-lg border ${
                available
                  ? "bg-muted border-primary/30"
                  : "bg-muted/50 border-amber-500/40"
              }`}
            >
              <div className="flex justify-between">
                <span className="text-sm font-medium">{size.size}</span>
                <span className="text-sm text-muted-foreground">
                  R$ {size.value.toFixed(2)}
                </span>
              </div>
              {!available && (
                <span className="text-[10px] font-medium text-amber-700 uppercase tracking-wide">
                  Entrega futura
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
