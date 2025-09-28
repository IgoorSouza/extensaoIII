import z from "zod";

export const paymentSchema = z.object({
  value: z.number().positive("Field 'value' must be greater than 0"),
  customerId: z.uuid("Field 'customerId' requires valid uuid."),
});
