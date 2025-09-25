import z from "zod";

export const paymentSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
  value: z.number().min(0.01, "Valor obrigatório"),
  customerId: z.string().nonempty("Cliente obrigatório"),
});