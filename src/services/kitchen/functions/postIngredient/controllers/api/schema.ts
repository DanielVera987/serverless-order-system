import { z } from 'zod';

export const PostIngredientSchema = z.object({
  name: z.string().trim().min(1),
  quantity: z.coerce.number().min(1),
});