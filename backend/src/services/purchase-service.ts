import * as purchaseRepository from "../repositories/purchase-repository";
import * as imageTextRecognitionService from "./image-text-recognition-service";
import { NotFoundException } from "../exceptions/not-found-exception";
import { PurchaseData } from "../types/purchase";

export async function getPurchases(
  page?: string,
  pageSize?: string,
  title?: string,
  customerId?: string,
  startDate?: string,
  endDate?: string
) {
  const pageNumber = Math.max(parseInt(page || "1") - 1, 0);
  const pageSizeNumber = Math.max(parseInt(pageSize || "10"), 1);
  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;

  const [purchases, totalCount] = await Promise.all([
    purchaseRepository.findPage(
      pageNumber,
      pageSizeNumber,
      title,
      customerId,
      parsedStartDate,
      parsedEndDate
    ),
    purchaseRepository.findTotalCount(
      title,
      customerId,
      parsedStartDate,
      parsedEndDate
    ),
  ]);

  return { purchases, totalCount };
}

export async function createPurchase(purchaseData: PurchaseData) {
  return await purchaseRepository.create(purchaseData);
}

export async function createPurchaseBatch(purchasesData: PurchaseData[]) {
  return await Promise.all(
    purchasesData.map(
      async (purchase) => await purchaseRepository.create(purchase)
    )
  );
}

export async function scanPurchases(image: Express.Multer.File) {
  const extractedText = await imageTextRecognitionService.extractTextFromImage(
    image
  );
  const textParts = extractedText.split("\n");
  const purchases: { title?: string; value?: number; date?: string }[] = [];

  textParts.forEach((part) => {
    const numberPart = Number(part.replace(",", "."));

    if (!Number.isNaN(numberPart)) {
      purchases[purchases.length - 1].value = numberPart;
    } else if (
      part.includes("/") &&
      Number.isInteger(Number(part.split("/")[0]))
    ) {
      purchases[purchases.length - 1].date = part;
    } else {
      purchases.push({
        title: part,
      });
    }
  });

  return purchases;
}

export async function updatePurchase(id: string, purchaseData: PurchaseData) {
  await throwErrorIfPurchaseNotExists(id);
  return await purchaseRepository.update(id, purchaseData);
}

export async function removePurchase(id: string) {
  await throwErrorIfPurchaseNotExists(id);
  await purchaseRepository.remove(id);
}

async function throwErrorIfPurchaseNotExists(id: string) {
  const purchase = await purchaseRepository.findById(id);

  if (!purchase) {
    throw new NotFoundException("Purchase not found.");
  }
}
