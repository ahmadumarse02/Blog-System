import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export function SiteCreateSchema(optional?: {
  isSubdirectoryUniqe: () => Promise<boolean>;
}) {
  return z.object({
    subdirectory: z
      .string()
      .min(1)
      .max(40)
      .regex(/^[a-z]+$/, "Subdirectory must only use lowercase letters.")
      .transform((value) => value.toLowerCase())
      .pipe(
        z.string().superRefine((email, ctx) => {
          if (typeof optional?.isSubdirectoryUniqe !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return optional.isSubdirectoryUniqe().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Subdirectory is already taken...",
              });
            }
          });
        })
      ),
    name: z.string().min(1).max(35),
    description: z.string().min(1),
  });
}
