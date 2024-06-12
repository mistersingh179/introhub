"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type IntroApproveConfirmationDialogProps = {};

const IntroApproveConfirmationDialog = (
  props: IntroApproveConfirmationDialogProps,
) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const showIntroApproveConfirmationDialog = searchParams.get(
    "showIntroApproveConfirmationDialog",
  );
  const pathName = usePathname();
  return (
    <>
      <Dialog
        open={Boolean(showIntroApproveConfirmationDialog)}
        onOpenChange={(newOpen) => {
          console.log("newOpen: ", newOpen);
          const params = new URLSearchParams(searchParams);
          params.delete("showIntroApproveConfirmationDialog");
          replace(`${pathName}?${params.toString()}`);
        }}
      >
        <DialogContent className={"sm:max-w-md md:max-w-4xl"}>
          <DialogHeader>
            <DialogTitle asChild>
              <div className={"flex flex-row gap-4 items-center"}>
                You have approved the Intro! <Rocket />
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className={"leading-8"} asChild>
            <div>
              <div>Here is what happens now:</div>
              <ul className={"list-inside list-disc mt-2"}>
                <li>
                  1 credit will be{" "}
                  <span className={"font-semibold"}>added to your account</span>{" "}
                  and 1 credit deducted from the requesters account.
                </li>
                <li>
                  If the requester has{" "}
                  <span className={"font-semibold"}>
                    positive credit balance
                  </span>{" "}
                  an introduction email will be sent out.
                </li>
                <li>
                  If the requester has{" "}
                  <span className={"font-semibold"}>negative balance</span> then
                  the intro email will wait in a queue till their balance
                  becomes positive.
                </li>
                <li>
                  If gaining this credit made your balance positive, then any
                  intro emails you may have waiting in a queue will be sent.{" "}
                </li>
              </ul>
            </div>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Continue</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntroApproveConfirmationDialog;
