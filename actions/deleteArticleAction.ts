"use server";

import prisma from "@/utils/prisma";
import { requireUser } from "@/utils/requireUser";
import { redirect } from "next/navigation";

export async function DeleteArticleAction(formData: FormData) {
  const user = await requireUser();

  await prisma.post.delete({
    where: {
      userId: user.id,
      id: formData.get("articleId") as string,
    },
  });

  return redirect(`/sites/${formData.get("siteId")}`);
}
