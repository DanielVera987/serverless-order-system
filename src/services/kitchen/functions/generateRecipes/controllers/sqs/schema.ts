import { z } from 'zod';

export const GenerateRecipesSchema = z.object({
  event: z.object({
    body: z.object({
      event: z.string(),
    }),
  }),
});