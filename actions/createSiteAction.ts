"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";

import prisma from "@/utils/prisma";
import { siteSchema } from "@/schemas/siteSchema";
import { requireUser } from "@/utils/requireUser";

export async function CreateSiteAction(prvState: unknown, formdata: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formdata, {
    schema: siteSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.site.create({
    data: {
      name: submission.value.name,
      subdirectory: submission.value.subdirectory,
      description: submission.value.description,
      userId: (await user).id,
    },
  });

  return redirect("/sites");
}
