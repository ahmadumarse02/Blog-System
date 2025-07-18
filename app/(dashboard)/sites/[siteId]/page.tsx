import EmptyState from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/utils/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Book, MoreHorizontalIcon, PlusCircle, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function getData(userId: string, siteId: string) {
  const data = await prisma.post.findMany({
    where: {
      userId: userId,
      siteId: siteId,
    },
    select: {
      image: true,
      title: true,
      cretedAt: true,
      id: true,
      Site: {
        select: {
          subdirectory: true,
        },
      },
    },
    orderBy: {
      cretedAt: "desc",
    },
  });

  return data;
}

async function SiteIdPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const resolvedParams = await params;
  const data = await getData(user.id, resolvedParams.siteId);

  return (
    <>
      <div className="flex w-full justify-end gap-x-4">
        {data.length > 0 && data[0].Site?.subdirectory && (
          <Button asChild variant="secondary">
            <Link href={`/blog/${data[0].Site.subdirectory}`}>
              <Book className="size-4 mr-2" />
              View Blog
            </Link>
          </Button>
        )}
        <Button asChild variant="secondary">
          <Link href={`/sites/${resolvedParams.siteId}/settings`}>
            <Settings className="size-4 mr-2" />
            Settings
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/sites/${resolvedParams.siteId}/create`}>
            <PlusCircle className="size-4 mr-2" />
            Create Article
          </Link>
        </Button>
      </div>

      {data === undefined || data.length === 0 ? (
        <EmptyState
          title="You don't have any Articles create"
          description="You currently don't have any articles. Pleae create some so that tou can see them right here"
          href={`/sites/${resolvedParams.siteId}/create`}
          buttonText="Create Articles"
        />
      ) : (
        <div className="">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
              <CardDescription>
                Manage your articles here. You can create, edit and delete your
                articles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Image
                          src={item.image}
                          alt="Article Cover Image"
                          width={64}
                          height={64}
                          className="size-16 rounded-md object-cover"
                        />
                      </TableCell>

                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-500"
                        >
                          Published
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {new Intl.DateTimeFormat("en-Us", {
                          dateStyle: "medium",
                        }).format(new Date(item.cretedAt))}
                      </TableCell>

                      <TableCell className="text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/sites/${resolvedParams.siteId}/${item.id}`}
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/sites/${resolvedParams.siteId}/${item.id}/delete`}
                              >
                                Delete
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default SiteIdPage;
