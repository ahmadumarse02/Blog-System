import RenderArticle from "@/components/dashboard/RenderArticle";
import { Button } from "@/components/ui/button";
import prisma from "@/utils/prisma";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";
import React from "react";

async function getData(slug: string) {
    const data = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
        select: {
            articleContent: true,
            title: true,
            smallDescription: true,
            image: true,
            cretedAt: true
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

async function SlugPage({ params }: { params: { slug: string, name: string } }) {
    const data = await getData((await params).slug)
    return (
        <>
            <div className="flex items-center gap-x-3 pt-10 pb-5">
                <Button asChild variant="outline" size="icon">
                    <Link href={`/blog/${(await params).name}`}>
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-medium">Go back</h1>
            </div>
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="m-auto w-full md:w-7/12 text-center">
                    <p className="m-auto my-5 w-10/12 text-sm font-light text-muted-foreground md:text-base">
                        {new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'medium',
                        }).format(data.cretedAt)
                        }
                    </p>
                    <h1 className="mb-5 text-xl font-bold md:text-5xl">{data.title}</h1>
                    <p className="m-auto w-10/12 text-muted-foreground line-clamp-3">{data.smallDescription}</p>
                </div>
            </div>

            <div className="relative mb-10 m-auto h-80 w-full
            max-w-screen-lg overflow-hidden md:mb-20 md:h-[450px] md:w-5/6 md:rounded-2xl lg:w-2/3">
                <Image 
                src={data.image} 
                alt={data.title} 
                width={1200} 
                height={630}
                className="size-full object-cover"
                priority
                />
            </div>
            <RenderArticle json={data.articleContent as JSONContent}/>
        </>
    )
}

export default SlugPage;
