import { z } from "zod";

export const shortenBodySchema = z.object({
  url: z.string().min(5, "url must be at least 5 characters"),
  code: z.string().optional(),
});

export type ShortenInput = z.infer<typeof shortenBodySchema>;
