import { z } from 'zod';

export const PostOrdersSchema = z.object({
  numberOrders: z.coerce.number().int().min(1),
});
