import type z from "zod";
import type { userSchema } from "../validators/users";

export type UserFormData = z.infer<typeof userSchema>;
