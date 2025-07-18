import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import UploadingImage from "@/components/dashboard/forms/UploadingImage";
import { DeleteSite } from "@/actions/deleteSite";
import SubmitedButton from "@/components/dashboard/SubmitedButton";

async function page({ params }: { params: Promise<{ siteId: string }> }) {
  const resolvedParams = await params;
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon">
          <Link href={`/sites/${resolvedParams.siteId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Go back</h3>
      </div>

      <UploadingImage siteId={resolvedParams.siteId} />

      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger</CardTitle>
          <CardDescription>
            This will delete your site and all articles associted with it. Click
            the button below to delete everything.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={DeleteSite}>
            <input type="hidden" name="siteId" value={resolvedParams.siteId} />
            <SubmitedButton text="Delete Everything" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </>
  );
}

export default page;
