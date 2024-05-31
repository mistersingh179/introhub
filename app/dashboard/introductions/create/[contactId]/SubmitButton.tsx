"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import React from "react";

type SubmitButtonProps = {
  label?: string | React.ReactElement;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  beDisabled?: boolean;
}; /**/
export default function SubmitButton(props: SubmitButtonProps) {
  const { size, label, className, beDisabled, variant } = props;
  const { pending } = useFormStatus();
  return (
    <Button
      className={className}
      type={"submit"}
      variant={variant}
      disabled={pending || beDisabled}
      size={size}
    >
      {label ?? "Submit"}
    </Button>
  );
}
