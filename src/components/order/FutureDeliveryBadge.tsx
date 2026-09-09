interface FutureDeliveryBadgeProps {
  className?: string;
}

/**
 * Marca um tamanho que só será entregue quando o produto voltar a estar disponível.
 *
 * O rótulo quebra em duas linhas ("Entrega" / "futura"): numa coluna estreita, o texto
 * em linha única alargaria a célula e empurraria as quantidades para outra linha.
 */
export const FutureDeliveryBadge = ({ className = "" }: FutureDeliveryBadgeProps) => (
  <span
    className={`inline-flex flex-col items-center rounded-lg bg-amber-100 px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] font-medium uppercase leading-tight tracking-wide text-amber-800 ${className}`}
  >
    <span>Entrega</span>
    <span>futura</span>
  </span>
);

/** Aviso no topo do card quando todos os tamanhos são de entrega futura. */
export const FutureDeliveryNotice = () => (
  <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-800">
    Produto disponível apenas para entrega futura
  </div>
);
