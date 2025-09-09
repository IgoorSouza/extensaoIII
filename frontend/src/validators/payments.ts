import z from "zod";

export const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, "Valor obrigatório"),
  payment_date: z.string().nonempty("Data obrigatória"),
});
