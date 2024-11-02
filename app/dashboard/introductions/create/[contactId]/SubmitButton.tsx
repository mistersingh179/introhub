"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import React from "react";
import { Loader2 } from "lucide-react";

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
    | "primary"
    | "success"
    | null
    | undefined;
  beDisabled?: boolean;
}; /**/

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (props, ref) => {
    const { size, label, className, beDisabled, variant } = props;
    const { pending } = useFormStatus();
    const labelMessage = label ?? "Submit";
    return (
      <Button
        ref={ref}
        className={className}
        type={"submit"}
        variant={variant}
        disabled={pending || beDisabled}
        size={size}
      >
        {pending && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        )}
        {!pending && labelMessage}
      </Button>
    );
  },
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
