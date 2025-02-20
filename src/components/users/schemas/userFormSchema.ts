
import { z } from "zod";

export const userFormSchema = z.object({
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal('')),
  confirmPassword: z.string()
}).refine((data) => {
  if (!data.password || data.password.trim() === '') {
    return true;
  }
  return data.password === data.confirmPassword;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
