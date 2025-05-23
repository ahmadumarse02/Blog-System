import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import DefaultImage from "@/public/default.png";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/utils/prisma";
import EmptyState from "@/components/dashboard/EmptyState";

async function getData(userId: string) {
  const data = await prisma.site.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      cretedAt: "desc",
    },
  });

  return data;
}

const SitesPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }
  const data = await getData((await user).id);

  return (
    <>
      <div className="flex w-full justify-end">
        <Button asChild>
          <Link href="/sites/new">
            <PlusCircle className="mr-2 size-4" /> Create Sites
          </Link>
        </Button>
      </div>

      {data === undefined || data.length === 0 ? (
        <EmptyState
          title="You don't have any Sites created"
          description='You currently dont have any Sites. Please create some so that you
                    can see them right here!"'
          href="/sites/new"
          buttonText="Create Sites"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {data.map((item) => (
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
      )}
    </>
  );
};

export default SitesPage;
