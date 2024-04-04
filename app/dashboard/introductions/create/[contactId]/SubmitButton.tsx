"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label?: string;
  className?: string;
  beDisabled?: boolean;
}; /**/
export default function SubmitButton(props: SubmitButtonProps) {
  const { label, className, beDisabled } = props;
  const { pending } = useFormStatus();
  return (
    <Button
      className={className}
      type={"submit"}
      disabled={pending || beDisabled}
    >
      {label ?? "Submit"}
    </Button>
  );
}
