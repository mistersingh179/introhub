"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label?: string;
}; /**/
export default function SubmitButton(props: SubmitButtonProps) {
  const { label } = props;
  const { pending } = useFormStatus();
  return (
    <Button type={"submit"} disabled={pending}>
      {label ?? "Submit"}
    </Button>
  );
}
