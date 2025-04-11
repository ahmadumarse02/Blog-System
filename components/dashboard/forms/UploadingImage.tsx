"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import SubmitButton from "../SubmitButton";
import { toast } from "sonner";
import { updateImage } from "@/actions/UpdateImage";

interface props {
  siteId: string;
}

function UploadingImage({ siteId }: props) {
  const [imageUrl, setImageUrl] = useState<string>("");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image</CardTitle>
        <CardDescription>
          This is the image of your site. You can upload a new image or remove
          the current one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Uploaded Image"
            width={200}
            height={200}
            className="size-[200px] bg-cover rounded-lg"
          />
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImageUrl(res[0].ufsUrl);
              toast.success("Image uploaded successfully!");
            }}
            onUploadError={() => {
              toast.error("Error uploading image");
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <form action={updateImage}>
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <SubmitButton text="Change Image" />
        </form>
      </CardFooter>
    </Card>
  );
}

export default UploadingImage;
