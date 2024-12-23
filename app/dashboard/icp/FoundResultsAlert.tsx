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
              If the contacts below are the type of people you want to meet, then you are all done! 
              Intros will arrive in your email soon 🎉
            </div>
          </li>
          <li>
            If the contacts {"don't"} match your ideal persona, update the 
            description and try again 🔁
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default FoundResultsAlert;
