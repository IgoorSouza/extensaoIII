import prisma from "../orm/prisma";
import { UserData } from "../types/user";

export async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function create(userData: UserData) {
  return await prisma.user.create({ data: userData });
}
