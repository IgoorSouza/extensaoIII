import { ZodError } from "zod";
import * as userService from "../services/user-service";
import { userSchema } from "../validators/user";
import { ConflictException } from "../exceptions/conflict-exception";

export async function createAdmin() {
  try {
    const admin = {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    };

    userSchema.parse(admin);

    await userService.createUser(admin);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("Error while creating admin: invalid admin credentials.");
    }

    if (error instanceof ConflictException) {
      console.info("Admin user already exists; skipping creation");
      return;
    }

    throw error;
  }
}
