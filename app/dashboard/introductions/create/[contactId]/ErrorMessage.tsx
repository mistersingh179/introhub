import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ErrorMessageProps = {
  title?: string;
  description?: string;
};
export default function ErrorMessage(props: ErrorMessageProps) {
  const { title, description } = props;
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title ?? "Error"}</AlertTitle>
      <AlertDescription>
        <pre>{description ?? "An error has occurred."}</pre>
      </AlertDescription>
    </Alert>
  );
}
