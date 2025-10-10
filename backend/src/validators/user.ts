import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Field 'name' is required."),
  email: z
    .email("Valid email is required")
    .min(1, "Field 'email' is required."),
  password: z.string().min(6, "Password must have atleast 6 digits."),
});
