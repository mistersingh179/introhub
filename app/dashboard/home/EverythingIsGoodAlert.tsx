import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PartyPopper } from "lucide-react";
import * as React from "react";

const EverythingIsGoodAlert = () => {
  return (
    <Alert variant={"brandedSubtle"}>
      <PartyPopper className="h-16 w-16" />
      <AlertTitle className={"ml-16 text-3xl"}>You are all Set!</AlertTitle>
      <AlertDescription className={"ml-20"}>
        <ul className="my-4 list-disc [&>li]:mt-4">
          <li className={"text-base"}>Your ICP has been recorded.</li>
          <li className={"text-base"}>
            Everyday {"we'll"} reach out to 1 (ONE) matching prospect for you,
            and ask them if they want to take an introduction with you.
          </li>
          <li className={"text-base"}>
            If they show interest, {"you'll"} receive an intro email with you{" "}
            {"cc'd"}.
          </li>
          <li className={"text-base"}>
            Get ready for meetings to be booked with interested prospects! 🎉
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
export default EverythingIsGoodAlert;
