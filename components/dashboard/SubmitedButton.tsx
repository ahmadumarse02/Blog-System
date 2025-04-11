"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface iAppProps {
  text: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

function SubmitedButton({ text, className, variant }: iAppProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className={cn("w-fit", className)} variant={variant}>
          <Loader2 className="mr-2 size-2 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button
          variant={variant}
          className={cn("w-fit", className)}
          type="submit"
        >
          {text}
        </Button>
      )}
    </>
  );
}

export default SubmitedButton;
