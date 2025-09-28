import z from "zod";
import { paymentSchema } from "../validators/payment";

export type PaymentData = z.infer<typeof paymentSchema>;

export interface CreatePaymentData {
  mercadoPagoId: string;
  value: number;
  status?: string;
  copyPasteCode: string;
  qrCode: string;
  customerId: string;
}