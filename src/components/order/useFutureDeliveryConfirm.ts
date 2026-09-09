import { useCallback, useRef, useState } from "react";

interface PendingSelection {
  size: string;
  proceed: () => void;
}

/**
 * Centraliza a confirmação de tamanhos de entrega futura, compartilhada pelos cards
 * de seleção do cliente.
 *
 * A seleção só é aplicada depois do "Incluir para entrega futura": quem chama não deve
 * atualizar o estado local antes, senão o cancelamento deixa o seletor num valor que o
 * cliente não confirmou.
 *
 * A confirmação é pedida uma única vez por tamanho — trocar a quantidade de um tamanho
 * já confirmado não reabre o diálogo.
 */
export const useFutureDeliveryConfirm = () => {
  const [pending, setPending] = useState<PendingSelection | null>(null);
  const confirmedSizes = useRef<Set<string>>(new Set());

  /**
   * @param isAvailable disponibilidade do tamanho
   * @param proceed aplica a seleção (estado local + callback do pedido)
   */
  const requestChange = useCallback(
    (size: string, isAvailable: boolean, proceed: () => void) => {
      if (isAvailable || confirmedSizes.current.has(size)) {
        proceed();
        return;
      }
      setPending({ size, proceed });
    },
    []
  );

  const confirm = useCallback(() => {
    if (!pending) return;
    confirmedSizes.current.add(pending.size);
    pending.proceed();
    setPending(null);
  }, [pending]);

  /** Cancelar não aplica nada, então o seletor permanece no valor anterior. */
  const cancel = useCallback(() => setPending(null), []);

  /** Desfaz a confirmação ao remover o item, para que ela seja pedida de novo. */
  const forgetConfirmation = useCallback((size: string) => {
    confirmedSizes.current.delete(size);
  }, []);

  return {
    pendingSize: pending?.size ?? null,
    isDialogOpen: pending !== null,
    requestChange,
    confirm,
    cancel,
    forgetConfirmation,
  };
};
