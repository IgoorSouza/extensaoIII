import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido").min(1, "O campo 'email' é obrigatório."),
  password: z.string().min(1, "O campo 'senha' é obrigatório."),
});
