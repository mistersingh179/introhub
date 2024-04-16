"use client";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import UpdateMessageForContactForm from "@/app/dashboard/introductions/list/UpdateMessageForContactForm";
import { useState } from "react";
import IntroRejectForm from "@/app/dashboard/introductions/list/IntroRejectForm";
import canStateChange from "@/services/canStateChange";
import { IntroStates } from "@/lib/introStates";

type IntroRejectDialogProps = {
  intro: IntroWithContactFacilitatorAndRequester;
};
export default function IntroRejectDialog(props: IntroRejectDialogProps) {
  const { intro } = props;
  const [open, setOpen] = useState(false);
  const canChange = canStateChange(
    intro.status as IntroStates,
    IntroStates.rejected,
  );
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'secondary'} className={'w-fit'} disabled={!canChange}>Reject</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Reject Introduction?</DialogTitle>
            <DialogDescription>
              Please tell the requester why you are rejecting this introduction
              request.
            </DialogDescription>
          </DialogHeader>
          <IntroRejectForm intro={intro} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
