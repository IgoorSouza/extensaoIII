import type z from "zod";
import type { purchaseSchema } from "../validators/purchases";

export type PurchaseFormData = z.infer<typeof purchaseSchema>;
