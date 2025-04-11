import React from "react";
import Link from "next/link";
import Image from "next/image";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/utils/prisma";
import { requireUser } from "@/utils/requireUser";
import DefaultImage from "@/public/default.png";

async function getData(userId: string) {
  const [sites, articles] = await Promise.all([
    prisma.site.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        cretedAt: "desc",
      },
      take: 3,
    }),
    prisma.post.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        cretedAt: "desc",
      },
      take: 3,
    }),
  ]);

  return { sites, articles };
}

const DashboardPage = async () => {
  const user = await requireUser();
  const { sites, articles } = await getData(user.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-5">Your Sites</h1>
      {sites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {sites.map((item) => (
            <Card key={item.id}>
              <Image
                src={item.imageUrl ?? DefaultImage}
                alt={item.name}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />

              <CardHeader className="truncate">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/sites/${item.id}`}>view Article</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any Sites created"
          description='You currently dont have any Sites. Please create some so that you
                    can see them right here!"'
          href="/sites/new"
          buttonText="Create Sites"
        />
      )}
      <h1 className="text-2xl mt-10 mb-5 font-semibold">Recent Articles</h1>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {articles.map((item) => (
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
                  <Link href={`/sites/${item.siteId}/${item.id}`}>
                    EditArticle
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You don't have any Articles create"
          description="You currently don't have any articles. Pleae create some so that tou can see them right here"
          href={`/sites/new`}
          buttonText="Create Articles"
        />
      )}
    </div>
  );
};

export default DashboardPage;
