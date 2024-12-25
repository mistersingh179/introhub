import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PartyPopper } from "lucide-react";
import * as React from "react";

const EverythingIsGoodAlert = () => {
  return (
    <Alert variant={"brandedSubtle"}>
      <PartyPopper className="h-16 w-16" />
      <AlertTitle className={"ml-16 text-3xl"}>You are all set!</AlertTitle>
      <AlertDescription className={"ml-20"}>
        <ul className="my-4 list-disc [&>li]:mt-4">
          <li className={"text-base"}>
            Everyday, {"we'll"} ask one contact if they would like to meet you.
          </li>
          <li className={"text-base"}>
            If they are interestetd, {"you'll"} receive an email introducing you{" "} to them.
          </li>
          <li className={"text-base"}>
            Your networking is now on autopilot 🎉
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
export default EverythingIsGoodAlert;
