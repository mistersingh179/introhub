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

type IntroRejectDialogProps = {
  introduction: IntroWithContactFacilitatorAndRequester;
};
export default function IntroRejectDialog(props: IntroRejectDialogProps) {
  const { introduction } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Reject Introduction?</DialogTitle>
            <DialogDescription>
              Please tell the requester why you are rejecting this introduction request.
            </DialogDescription>
          </DialogHeader>
          <IntroRejectForm introduction={introduction} setOpen={setOpen}  />
        </DialogContent>
      </Dialog>
    </>
  );
}
