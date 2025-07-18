"use server";

import prisma from "@/utils/prisma";
import { requireUser } from "@/utils/requireUser";
import { redirect } from "next/navigation";

export async function DeleteSite(formData: FormData) {
  const user = requireUser();

  await prisma.site.delete({
    where: {
      userId: (await user).id,
      id: formData.get("siteId") as string,
    },
  });

  return redirect("/sites");
}
