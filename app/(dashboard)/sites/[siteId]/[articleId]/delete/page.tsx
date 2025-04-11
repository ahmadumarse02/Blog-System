import React from "react";
import Link from "next/link";
import { DeleteArticleAction } from "@/actions/deleteArticleAction";
import SubmitButton from "@/components/dashboard/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function DeletePage({
  params,
}: {
  params: Promise<{ siteId: string; articleId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are You absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            article and remove it from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href={`/sites/${resolvedParams.siteId}`}>Cancel</Link>
          </Button>
          <form action={DeleteArticleAction}>
            <input
              type="hidden"
              name="articleId"
              value={resolvedParams.articleId}
            />
            <input type="hidden" name="siteId" value={resolvedParams.siteId} />
            <SubmitButton variant="destructive" text="Delete Article" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DeletePage;
