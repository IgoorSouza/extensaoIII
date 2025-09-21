import { Router, type Express } from "express";
import * as purchaseService from "../services/purchase-service";
import { PurchaseData } from "../types/purchase";
import { validateRequestBody } from "../middlewares/request-body-validator";
import { purchaseSchema } from "../validators/purchase";

export default function purchaseController(app: Express) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const { page, pageSize, title, customerId, startDate, endDate } =
        req.query as {
          page?: string;
          pageSize?: string;
          title?: string;
          customerId?: string;
          startDate?: string;
          endDate?: string;
        };

      const { purchases, totalCount } = await purchaseService.getPurchases(
        page,
        pageSize,
        title,
        customerId,
        startDate,
        endDate
      );

      res.status(200).json({ purchases, totalCount });
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/",
    validateRequestBody(purchaseSchema),
    async (req, res, next) => {
      try {
        const purchaseData: PurchaseData = req.body;
        const purchase = await purchaseService.createPurchase(purchaseData);

        res.status(200).json(purchase);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/:id",
    validateRequestBody(purchaseSchema),
    async (req, res, next) => {
      try {
        const purchaseId = req.params.id;
        const purchaseData: PurchaseData = req.body;
        const purchase = await purchaseService.updatePurchase(
          purchaseId,
          purchaseData
        );

        res.status(200).json(purchase);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete("/:id", async (req, res, next) => {
    try {
      const purchaseId = req.params.id;
      await purchaseService.removePurchase(purchaseId);

      res.status(200).json({ message: "Purchase successfully deleted." });
    } catch (error) {
      next(error);
    }
  });

  app.use("/purchase", router);
}