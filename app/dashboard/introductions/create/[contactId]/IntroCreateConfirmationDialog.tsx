"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";

type IntroCreateConfirmationDialogProps = {
  open: boolean;
};
const IntroCreateConfirmationDialog = (
  props: IntroCreateConfirmationDialogProps,
) => {
  const { open } = props;
  const router = useRouter();

  return (
    <>
      <Dialog open={open}>
        <DialogContent
          hideCloseButton={true}
          className="sm:max-w-[425px] md:max-w-4xl"
        >
          <DialogHeader>
            <DialogTitle>
              <div className={"flex flex-row gap-4 items-center"}>
                Successfully created introduction! <PartyPopper />
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className={"mt-4"}>Here is what happens next:</div>
            <ul className={"list-inside list-disc mt-4 leading-8"}>
              <li>Intro will be sent to the facilitator for approval.</li>
              <li>
                If <span className={"font-semibold"}>approved</span>, we will
                deduct 1 credit from your balance and give 1 credit to the
                facilitator.
              </li>
              <li>
                Then if your credit balance is positive, the approved
                introduction will be emailed out with you {`cc'ed`}.
              </li>
              <li>
                But if your credit balance is negative, then the approved
                introduction will wait in a queue and be emailed out when your
                credit balance becomes positive again.
              </li>
              <li>
                Note: You can earn credits and make your balance positive by
                approving introductions pending on you.
              </li>
            </ul>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => {
                router.back();
              }}
              type="submit"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntroCreateConfirmationDialog;
