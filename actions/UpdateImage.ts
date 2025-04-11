"use server";

import prisma from "@/utils/prisma";
import { requireUser } from "@/utils/requireUser";
import { redirect } from "next/navigation";

export async function updateImage(formData: FormData) {
  const user = await requireUser();

  await prisma.site.update({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
    data: {
      imageUrl: formData.get("imageUrl") as string,
    },
  });

  return redirect(`/sites/${formData.get("siteId")}`);
}
