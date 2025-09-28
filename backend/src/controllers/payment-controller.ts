import { Router, type Express } from "express";
import * as paymentService from "../services/payment-service";
import { PaymentData } from "../types/payment";
import { validateRequestBody } from "../middlewares/request-body-validator";
import { paymentSchema } from "../validators/payment";

export default function paymentController(app: Express) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const { page, pageSize, customerId, startDate, endDate } = req.query as {
        page?: string;
        pageSize?: string;
        customerId?: string;
        startDate?: string;
        endDate?: string;
      };

      const { payments, totalCount } = await paymentService.getPayments(
        page,
        pageSize,
        customerId,
        startDate,
        endDate
      );

      res.status(200).json({ payments, totalCount });
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/",
    validateRequestBody(paymentSchema),
    async (req, res, next) => {
      try {
        const paymentData: PaymentData = req.body;
        const pixData = await paymentService.createPixPayment(paymentData);

        res.status(201).json(pixData);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post("/webhook", async (req, res, next) => {
    try {
      const xSignature = req.header("x-signature");
      const xRequestId = req.header("x-request-id");
      const { "data.id": paymentId, type } = req.query as {
        "data.id": string | undefined;
        type: string | undefined;
      };

      await paymentService.handleWebhookNotification(
        xSignature,
        xRequestId,
        type,
        paymentId
      );

      res.status(200).send("OK");
    } catch (error) {
      next(error);
    }
  });

  app.use("/payment", router);
}
