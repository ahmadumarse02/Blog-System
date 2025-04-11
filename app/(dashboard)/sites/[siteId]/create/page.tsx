"use client";

import React, { use, useActionState, useState } from "react";
import { JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Atom } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { UploadDropzone } from "@/utils/uploadthing";
import TailwindEditor from "@/components/dashboard/Editor/EditorWrapper";
import { CreatePostAction } from "@/actions/createPostAction";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema } from "@/schemas/postSchema";
import slugify from "react-slugify";
import { SubmitButton } from "@/components/dashboard/SubmitButton";

function CreatePage({ params }: { params: Promise<{ siteId: string }> }) {
  const unwrappedParams = use(params);
  const siteId = unwrappedParams.siteId;

  // Initialize all states with proper default values
  const [imageUrl, setImageUrl] = useState("");
  const [value, setValue] = useState<JSONContent>({ type: "doc", content: [] });
  const [slug, setSlug] = useState("");
  const [lastResult, action] = useActionState(CreatePostAction, undefined);
  const [title, setTitle] = useState("");
  const [form, field] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handelSlugGeneration() {
    if (!title.trim()) {
      return toast.error("Please enter a title first");
    }
    setSlug(slugify(title));
    return toast.success("Slug has been created");
  }

  return (
    <>
      <div className="flex items-center">
        <Button size="icon" variant="outline" className="mr-3" asChild>
          <Link href={`/sites/${siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create Article</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Description</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
            vero?
          </CardDescription>
          <CardContent>
            <form
              action={action}
              className="flex flex-col gap-6"
              id={form.id}
              onSubmit={form.onSubmit}
            >
              <Input type="hidden" name="siteId" value={siteId} />

              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  placeholder="Next js blogging application"
                  name={field.title.name}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-red-500 text-sm">{field.title.errors}</p>
              </div>

              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input
                  placeholder="Article Slug"
                  name={field.slug.name}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <Button
                  className="w-fit"
                  variant="secondary"
                  type="button"
                  onClick={handelSlugGeneration}
                >
                  <Atom className="size-4 mr-2" />
                  Generate Slug
                </Button>
                <p className="text-red-500 text-sm">{field.slug.errors}</p>
              </div>

              <div className="grid gap-2">
                <Label>Small Description</Label>
                <Textarea
                  placeholder="Small Description of your blog article..."
                  className="h-32"
                  name={field.smallDescription.name}
                  defaultValue={field.smallDescription.initialValue || ""}
                />
                <p className="text-red-500 text-sm">
                  {field.smallDescription.errors}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Cover Image</Label>
                <Input type="hidden" name={field.image.name} value={imageUrl} />
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Uploaded Image"
                    className="object-cover w-[200px] h-[200px] rounded-lg"
                    width={200}
                    height={200}
                  />
                ) : (
                  <UploadDropzone
                    onClientUploadComplete={(res) => {
                      setImageUrl(res[0].url);
                      toast.success("Image has been uploaded");
                    }}
                    endpoint="imageUploader"
                    onUploadError={() => {
                      toast.error("Something went wrong...");
                    }}
                  />
                )}
                <p className="text-red-500 text-sm">{field.image.errors}</p>
              </div>

              <div className="grid gap-2">
                <Label>Article Content</Label>
                <Input
                  type="hidden"
                  name={field.articleContent.name}
                  value={JSON.stringify(value)}
                />
                <TailwindEditor onChange={setValue} initialValue={value} />
                <p className="text-red-500 text-sm">
                  {field.articleContent.errors}
                </p>
              </div>

              <SubmitButton text="Create Article" />
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}

export default CreatePage;
