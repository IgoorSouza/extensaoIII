import type z from "zod";
import type { paymentSchema } from "../validators/payments";

export type PaymentFormData = z.infer<typeof paymentSchema>;
