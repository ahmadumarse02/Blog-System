"use server"

import { redirect } from "next/navigation";
import { parseWithZod} from "@conform-to/zod"

import { PostSchema } from "@/schemas/postSchema";
import prisma from "@/utils/prisma";
import { requireUser } from "@/utils/requireUser";

export async function CreatePostAction(prevState: unknown,formData: FormData) {
    const user = await requireUser()

    const submission = parseWithZod(formData, {
        schema: PostSchema
    })

    if(submission.status !== "success") {
        return submission.reply();
    }

     await prisma.post.create({
        data: {
            title: submission.value.title,
            smallDescription: submission.value.smallDescription,
            slug: submission.value.slug,
            articleContent: JSON.parse(submission.value.articleContent),
            image: submission.value.image,
            userId:  (await user).id,
            siteId: formData.get("siteId") as string,
        },
    })

    return redirect(`/sites/${formData.get("siteId")}`)
}


export async function EditPostAction(prevState: unknown, formData: FormData) {
    const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.post.update({
    where: {
      userId: user.id,
      id: formData.get("articleId") as string,
    },
    data: {
      title: submission.value.title,
      smallDescription: submission.value.smallDescription,
      slug: submission.value.slug,
      articleContent: JSON.parse(submission.value.articleContent),
      image: submission.value.image,
    },
  });

  return redirect(`/sites/${formData.get("siteId")}`);
}