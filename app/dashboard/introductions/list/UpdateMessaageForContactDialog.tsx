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

type UpdateMessageForContactDialog = {
  introduction: IntroWithContactFacilitatorAndRequester;
};
export default function UpdateMessageForContactDialog(
  props: UpdateMessageForContactDialog,
) {
  const { introduction } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"link"} className={"h-2"}>
            <Pencil size={12} className={"inline"} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>View Introduction</DialogTitle>
            <DialogDescription>
              Make changes to the message which your will be sending to the
              prospect.
            </DialogDescription>
          </DialogHeader>
          <UpdateMessageForContactForm
            introduction={introduction}
            setOpen={setOpen}
          />
          {/*<DialogFooter>*/}
          {/*  <Button type="submit">Save changes</Button>*/}
          {/*</DialogFooter>*/}
        </DialogContent>
      </Dialog>
    </>
  );
}
