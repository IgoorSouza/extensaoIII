import z from "zod";
import { authSchema } from "../validators/auth";

export type AuthData = z.infer<typeof authSchema>;