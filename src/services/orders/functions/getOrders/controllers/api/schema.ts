import { z } from "zod";

export const schema = z.object({
    status: z.string().nonempty().optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    nextToken: z.string().nonempty().optional(),
});