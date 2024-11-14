import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-background dark:border-input",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground",
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20",
        link: "bg-transparent text-primary underline underline-offset-4 hover:underline hover:text-primary-foreground",
        primary:
          "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:border-blue-500 dark:text-blue-100 dark:hover:bg-blue-800",
        primarySubtle:
          "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-800",
        primaryOutline:
          "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-900",
        success:
          "bg-green-600 text-white border-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:text-green-100 dark:border-green-600 dark:hover:bg-green-800",
        successSubtle:
          "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800",
        successOutline:
          "border border-green-600 text-green-600 bg-transparent hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900",
        branded:
          "bg-[rgb(147,51,234)] text-white border-[rgb(147,51,234)] hover:bg-[rgb(124,41,197)] dark:bg-[rgb(124,41,197)] dark:border-[rgb(124,41,197)] dark:text-white",
        brandedSubtle:
          "bg-[rgb(237,233,254)] text-[rgb(147,51,234)] border-[rgb(209,189,252)] hover:bg-[rgb(221,214,254)] dark:bg-[rgb(75,0,130)] dark:text-[rgb(209,189,252)] dark:border-[rgb(124,41,197)] dark:hover:bg-[rgb(90,0,160)]",
        brandedOutline:
          "border-[rgb(147,51,234)] text-[rgb(147,51,234)] bg-transparent hover:bg-[rgb(237,233,254)] dark:border-[rgb(209,189,252)] dark:text-[rgb(209,189,252)] dark:hover:bg-[rgb(75,0,130)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
