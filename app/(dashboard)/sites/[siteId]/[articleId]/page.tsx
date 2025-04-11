import { EditArticleForm } from "@/components/dashboard/forms/EditArticleForm"
import { Button } from "@/components/ui/button"
import prisma from "@/utils/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JSONContent } from "novel"


async function getData(postId: string) {
    const data = await prisma.post.findUnique({
        where:{
            id: postId,
        },
        select: {
            image: true,
            title: true,
            smallDescription: true,
            slug: true,
            articleContent: true,
            id: true,
        }
    })
    
    if(!data) {
        return notFound()
    }

    return {
        ...data,
        articleContent: (data.articleContent as JSONContent) ?? {},
    }
}

async function EditPage({ params }: { params: { articleId: string;siteId: string } }) {
    const data = await getData(params.articleId)
  return (
    <div>
        <div className="flex items-center">
            <Button size="icon" variant="outline" asChild className="mr-5">
                <Link href={`/sites/${(await params).siteId}`}><ArrowLeft className="size-4"/></Link>
            </Button>
            <h1 className="text-2xl font-semibold">Edit Article</h1>
        </div>
        <EditArticleForm data={{ ...data, articleContent: data.articleContent as JSONContent }} 
        siteId={ params.siteId}
        />
    </div>
  )
}

export default EditPage