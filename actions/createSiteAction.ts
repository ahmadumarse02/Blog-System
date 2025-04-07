"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod} from "@conform-to/zod"
import { siteSchema } from "@/schemas/siteSchema";
import prisma from "@/utils/prisma";

export async function CreateSiteAction(prvState: unknown, formdata: FormData) {
    const { getUser } = getKindeServerSession();

    const user = getUser();

    if(!user) {
        return redirect("/api/auth/login")
    }

    const submission = parseWithZod(formdata, {
        schema: siteSchema
    })

    if(submission.status !== "success") {
        return submission.reply();
    }

    await prisma.site.create({
        data: {
            name: submission.value.name,
            subdirectory: submission.value.subdirectory,
            description: submission.value.description,
            userId: (await user).id
        }
    })

    return redirect("/dashboard/sites")
}