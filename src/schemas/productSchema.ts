
import * as z from "zod";

export const productFormSchema = z.object({
  _id: z.string().optional(),
  reference: z.string().min(1, "Referência deve ter no mínimo 1 caractere"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  image: z.string().optional(),
  sizes: z.array(
    z.object({
      size: z.string().min(1, "Tamanho não pode ficar vazio"),
      value: z.number().min(0.01, "Valor deve ser maior que zero"),
    })
  ).min(1, "Adicione pelo menos um tamanho"),
  quantities: z.array(
    z.object({
      value: z.number().min(0.01, "Quantidade deve ser maior que zero"),
    })
  ).min(1, "Adicione pelo menos uma quantidade"),
  isNew: z.boolean().optional(),
});

export type ProductFormSchemaType = z.infer<typeof productFormSchema>;
