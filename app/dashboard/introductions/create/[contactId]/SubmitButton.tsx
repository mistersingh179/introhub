import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label?: string;
}; /**/
export default function SubmitButton(props: SubmitButtonProps) {
  const { label } = props;
  const { pending } = useFormStatus();
  return <Button disabled={pending}>{label ?? "Submit"}</Button>;
}
