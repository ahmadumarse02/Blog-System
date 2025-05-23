import { FileIcon, PlusCircle } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface props {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

function EmptyState({ title, buttonText, description, href }: props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <FileIcon className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      <Button asChild>
        <Link href={href}>
          <PlusCircle className="mr-2 size-4" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
}

export default EmptyState;
