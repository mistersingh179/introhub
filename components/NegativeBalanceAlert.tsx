import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import * as React from "react";

const NegativeBalanceAlert = () => {
  return (
    <Alert variant="default">
      <AlertCircle className="h-8 w-8" />
      <AlertTitle className={"ml-8"}>Negative Balance</AlertTitle>
      <AlertDescription className={"ml-8"}>
        <p>
          Since you have a negative credits balance, intros created by you will
          sit in a queue after being approved and wait for your balance to be
          positive again. Once your balance is positive they will be emailed
          out with you {`cc'ed`} on them.
        </p>
        <p className={'mt-2'}>
          You can earn credits and make your balance positive by approving
          introductions pending on you.
        </p>
      </AlertDescription>
    </Alert>
  )
}

export default NegativeBalanceAlert