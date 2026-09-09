import type { Product, ProductSize } from "@/types/product";

/**
 * Disponibilidade e preço são dimensões independentes: um tamanho de entrega futura
 * mantém seu valor, que é quanto o cliente pagará quando o produto chegar.
 *
 * A comparação é sempre `!== false` porque produtos cadastrados antes desta
 * funcionalidade não têm o campo `available` e devem contar como disponíveis.
 */
export const isSizeAvailable = (size: Pick<ProductSize, "available">): boolean =>
  size.available !== false;

/** Produto cujos tamanhos são todos de entrega futura. */
export const isProductFullyUnavailable = (product: Pick<Product, "sizes">): boolean =>
  (product.sizes?.length ?? 0) > 0 && product.sizes.every(size => !isSizeAvailable(size));

/** Normaliza `available` ao carregar um produto no formulário, para o switch refletir o estado real. */
export const withNormalizedAvailability = (sizes: ProductSize[] = []): ProductSize[] =>
  sizes.map(size => ({ ...size, available: isSizeAvailable(size) }));
