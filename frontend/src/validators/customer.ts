import z from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.email("Email inválido"),
  cpf: z
    .string()
    .min(11, "CPF obrigatório")
    .max(11, "CPF deve ter no máximo 11 dígitos"),
  phone: z
    .string()
    .min(8, "Telefone obrigatório")
    .max(8, "Telefone deve ter no máximo 8 dígitos"),
});
