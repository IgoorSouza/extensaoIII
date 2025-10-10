import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido").min(1, "O campo 'email' é obrigatório."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 dígitos."),
});
