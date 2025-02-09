
import * as z from "zod";

export const productFormSchema = z.object({
  reference: z.string().min(4, "Referência deve ter no mínimo 4 caracteres"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  sizes: z.array(
    z.object({
      size: z.string(),
      value: z.number().min(0),
    })
  ),
  quantities: z.array(z.number()),
});
