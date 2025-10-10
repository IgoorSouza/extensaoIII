import bcrypt from "bcryptjs";
import { ConflictException } from "../exceptions/conflict-exception";
import * as userRepository from "../repositories/user-repository";
import { UserData } from "../types/user";

export async function getUserByEmail(email: string) {
  return await userRepository.findByEmail(email);
}

export async function createUser(userData: UserData) {
  const user = await getUserByEmail(userData.email);

  if (user) {
    throw new ConflictException(
      `User with email ${userData.email} already exists.`
    );
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  const createdUser = await userRepository.create({
    ...userData,
    password: encryptedPassword,
  });

  return { ...createdUser, password: undefined };
}
