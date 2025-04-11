"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";

import prisma from "@/utils/prisma";
import { requireUser } from "@/utils/requireUser";
import { SiteCreateSchema } from "@/schemas/siteCreateSchema";

export async function CreateSiteAction(prvState: unknown, formdata: FormData) {
  const user = await requireUser();

  const submission = await parseWithZod(formdata, {
    schema: SiteCreateSchema({
      async isSubdirectoryUniqe() {
        const exitingSubDirectory = await prisma.site.findUnique({
          where: {
            subdirectory: formdata.get("subdirectory") as string,
          },
        });
        return !exitingSubDirectory;
      },
    }),
    async: true,
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

// "use server";

// import { redirect } from "next/navigation";
// import { parseWithZod } from "@conform-to/zod";

// import prisma from "@/utils/prisma";
// import { siteSchema } from "@/schemas/siteSchema";
// import { requireUser } from "@/utils/requireUser";

// export async function CreateSiteAction(prvState: unknown, formdata: FormData) {
//   const user = await requireUser();

//   const submission = parseWithZod(formdata, {
//     schema: siteSchema,
//   });

//   if (submission.status !== "success") {
//     return submission.reply();
//   }

//   await prisma.site.create({
//     data: {
//       name: submission.value.name,
//       subdirectory: submission.value.subdirectory,
//       description: submission.value.description,
//       userId: (await user).id,
//     },
//   });

//   return redirect("/sites");
// }
