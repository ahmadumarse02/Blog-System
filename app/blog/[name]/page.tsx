import React from "react";
import prisma from "@/utils/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Logo from "@/public/logo.svg";
import { ThemeToggle } from "@/components/dashboard/ThemeToogle";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DefaultImage from "@/public/default.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(subDir: string) {
  const data = await prisma.site.findUnique({
    where: {
      subdirectory: subDir,
    },
    select: {
      name: true,
      Post: {
        select: {
          smallDescription: true,
          title: true,
          slug: true,
          image: true,
          cretedAt: true,
          id: true,
        },
        orderBy: {
          cretedAt: "desc",
        },
      },
    },
  });

  if (!data) return notFound();
  return data;
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const data = await getData(name);

  return (
    <>
      <nav className="grid grid-cols-3 my-10">
        <div className="col-span-1">
          <div className="flex items-center gap-x-2 justify-center">
            <Image src={Logo} alt="Logo" width={40} height={40} />
            <h1 className="text-3xl font-semibold">{data.name}</h1>
          </div>
        </div>
        <div className="col-span-2 flex w-full justify-end -mt-10">
          <ThemeToggle />
        </div>
      </nav>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {data.Post.map((item) => (
          <Card key={item.id}>
            <Image
              src={item.image ?? DefaultImage}
              alt={item.title}
              className="rounded-t-lg object-cover w-full h-[200px]"
              width={400}
              height={200}
            />
            <CardHeader className="truncate">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {item.smallDescription}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/blog/${name}/${item.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
