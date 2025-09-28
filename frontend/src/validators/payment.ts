import z from "zod";

export const paymentSchema = z.object({
  value: z.number().min(0.01, "Valor obrigatório"),
  customerId: z.string().nonempty("Cliente obrigatório"),
});