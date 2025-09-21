import * as purchaseRepository from "../repositories/purchase-repository";
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

  return await purchaseRepository.findPage(
    pageNumber,
    pageSizeNumber,
    title,
    customerId,
    parsedStartDate,
    parsedEndDate
  );
}

export async function createPurchase(purchaseData: PurchaseData) {
  return await purchaseRepository.create(purchaseData);
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
