import z from "zod";
import { userSchema } from "../validators/user";

export type UserData = z.infer<typeof userSchema>;
