import { Cable } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as React from "react";

const FoundResultsAlert = ({ foundCount }: { foundCount: string }) => {
  return (
    <Alert variant={"brandedSubtle"}>
      <Cable className="h-8 w-8" />
      <AlertTitle className={"ml-8"}>
        Your ICP matches {foundCount} records in the database
      </AlertTitle>
      <AlertDescription className={"ml-8"}>
        <ul className="my-4 list-disc [&>li]:mt-4">
          <li>
            <div>
              If the sample prospects below match your ICP, relax and wait for
              introductions to arrive in your inbox 🎉.
            </div>
            <div>
              {"We'll"} reach out to matching prospects, and if {"they're"}{" "}
              interested, {"you'll"} receive an intro email with you {"cc'd"}.
              Get ready for meetings to be booked with interested prospects! ✅
            </div>
          </li>
          <li>
            If the sample prospects {"don't"} match your ICP, modify the ICP
            description and hit preview to try again. 🔁
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default FoundResultsAlert;
