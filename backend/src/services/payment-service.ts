import { MercadoPagoConfig, Payment as MercadoPagoPayment } from "mercadopago";
import * as paymentRepository from "../repositories/payment-repository";
import * as customerService from "./customer-service";
import { PaymentData } from "../types/payment";
import { NotFoundException } from "../exceptions/not-found-exception";

const mercadoPagoWebhookKey = process.env.MERCADO_PAGO_WEBHOOK_KEY;
const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_API_TOKEN!,
});
const mercadoPagoPaymentApi = new MercadoPagoPayment(mercadoPagoClient);

export async function getPayments(
  page?: string,
  pageSize?: string,
  customerId?: string,
  startDate?: string,
  endDate?: string
) {
  const pageNumber = Math.max(parseInt(page || "1") - 1, 0);
  const pageSizeNumber = Math.max(parseInt(pageSize || "10"), 1);
  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;

  const [payments, totalCount] = await Promise.all([
    paymentRepository.findPage(
      pageNumber,
      pageSizeNumber,
      customerId,
      parsedStartDate,
      parsedEndDate
    ),
    paymentRepository.findTotalCount(
      customerId,
      parsedStartDate,
      parsedEndDate
    ),
  ]);

  return { payments, totalCount };
}

async function getMercadoPagoPaymentDetails(mercadoPagoId: string) {
  try {
    const payment = await mercadoPagoPaymentApi.get({
      id: Number(mercadoPagoId),
    });

    return payment;
  } catch (error) {
    console.error(
      `Error fetching Mercado Pago payment ${mercadoPagoId}:`,
      error
    );
    return null;
  }
}

export async function createPixPayment(paymentData: PaymentData) {
  const customer = await customerService.getCustomerById(
    paymentData.customerId
  );

  const mercadoPagoPayment = await mercadoPagoPaymentApi.create({
    body: {
      transaction_amount: paymentData.value,
      payment_method_id: "pix",
      payer: {
        phone: {
          area_code: customer.phone.slice(0, 2),
          number: customer.phone.slice(2),
        },
        email: customer.email,
        first_name: customer.name.split(" ")[0],
        last_name: customer.name.split(" ").slice(1).join(" "),
        identification: {
          type: "CPF",
          number: customer.cpf,
        },
      },
      notification_url: `${process.env.BACKEND_URL}/payment/webhook`,
    },
  });

  const copyPasteCode =
    mercadoPagoPayment.point_of_interaction?.transaction_data?.qr_code!;

  const qrCode =
    mercadoPagoPayment.point_of_interaction?.transaction_data?.qr_code_base64!;

  const payment = await paymentRepository.create({
    mercadoPagoId: String(mercadoPagoPayment.id),
    value: paymentData.value,
    customerId: customer.id,
    status: mercadoPagoPayment.status,
    copyPasteCode,
    qrCode,
  });

  return {
    copyPasteCode,
    qrCode,
    paymentId: payment.id,
  };
}

export async function handleWebhookNotification(
  webhookKey: string,
  paymentId: string
) {
  if (mercadoPagoWebhookKey !== webhookKey) {
    console.warn(`Request with invalid secret key: ${paymentId}`);
    return;
  }

  const payment = await paymentRepository.findByMercadoPagoId(paymentId);

  if (!payment) {
    console.warn(`Payment not found for Mercado Pago ID: ${paymentId}`);
    throw new NotFoundException("Payment not found");
  }

  const mercadoPagoPaymentDetails = await getMercadoPagoPaymentDetails(
    paymentId
  );

  if (!mercadoPagoPaymentDetails) {
    console.error(
      `Failed to retrieve details for Mercado Pago ID: ${paymentId}`
    );
    throw new Error("Failed to retrieve payment details from Mercado Pago.");
  }

  const newStatus = mercadoPagoPaymentDetails.status;

  if (newStatus && payment.status !== newStatus) {
    await paymentRepository.updateStatus(payment.id!, newStatus);
  }
}
