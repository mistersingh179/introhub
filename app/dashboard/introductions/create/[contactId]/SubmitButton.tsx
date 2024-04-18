"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  beDisabled?: boolean;
}; /**/
export default function SubmitButton(props: SubmitButtonProps) {
  const { label, className, beDisabled, variant } = props;
  const { pending } = useFormStatus();
  return (
    <Button
      className={className}
      type={"submit"}
      variant={variant}
      disabled={pending || beDisabled}
    >
      {label ?? "Submit"}
    </Button>
  );
}
