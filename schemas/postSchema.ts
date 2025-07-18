import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(190),
  image: z.string().min(1),
  smallDescription: z.string().min(1),
  articleContent: z.string().min(8),
});
