"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label?: string;
  className?: string;
}; /**/
export default function SubmitButton(props: SubmitButtonProps) {
  const { label, className } = props;
  const { pending } = useFormStatus();
  return (
    <Button className={className} type={"submit"} disabled={pending}>
      {label ?? "Submit"}
    </Button>
  );
}
