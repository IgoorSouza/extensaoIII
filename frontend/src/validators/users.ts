import z from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.email("Email inválido"),
  cpf: z.string().min(11, "CPF obrigatório"),
  phone: z.string().min(8, "Telefone obrigatório"),
});
