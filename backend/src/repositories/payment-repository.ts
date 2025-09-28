import prisma from "../orm/prisma";
import { CreatePaymentData } from "../types/payment";

export async function findPage(
  page: number,
  pageSize: number,
  customerId?: string,
  startDate?: Date,
  endDate?: Date
) {
  return await prisma.payment.findMany({
    skip: page * pageSize,
    take: pageSize,
    where: {
      customerId: customerId || undefined,
      createdAt:
        startDate || endDate
          ? {
              gte: startDate,
              lte: endDate,
            }
          : undefined,
    },
    include: {
      Customer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findTotalCount(
  customerId?: string,
  startDate?: Date,
  endDate?: Date
) {
  return await prisma.payment.count({
    where: {
      customerId: customerId || undefined,
      createdAt:
        startDate || endDate
          ? {
              gte: startDate,
              lte: endDate,
            }
          : undefined,
    },
  });
}

export async function findById(id: string) {
  return await prisma.payment.findUnique({
    where: { id },
  });
}

export async function findByMercadoPagoId(mercadoPagoId: string) {
  return await prisma.payment.findUnique({
    where: {
      mercadoPagoId,
    },
  });
}

export async function create(paymentData: CreatePaymentData) {
  return await prisma.payment.create({ data: paymentData });
}

export async function updateStatus(id: string, status: string) {
  return await prisma.payment.update({
    where: { id },
    data: { status },
  });
}
