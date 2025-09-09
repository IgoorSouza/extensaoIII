import z from "zod";

export const purchaseSchema = z.object({
  title: z.string().min(2, "Título obrigatório"),
  description: z.string().optional(),
  date: z.string().nonempty("Data obrigatória"),
  user_id: z.string().nonempty("Cliente obrigatório"),
});
