"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import {Introduction} from "@prisma/client";
import {MessageCircleOff, X} from "lucide-react";
import CancelIntroForm from "@/app/dashboard/introductions/pendingQueue/CancelIntroForm";

type CancelIntroDialogProps = {
  intro: Introduction;
};

const CancelIntroDialog = (props: CancelIntroDialogProps) => {
  const { intro } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"destructive"}
            className={"ml-2 w-fit"}
          >
            <MessageCircleOff size={14} className={'mr-2'} />
            Cancel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Intro</DialogTitle>
            <DialogDescription>
              Are you sure you want to Cancel this intro request?
            </DialogDescription>
          </DialogHeader>
          <CancelIntroForm setOpen={setOpen} intro={intro} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CancelIntroDialog;
