"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign } from "lucide-react";
import React, { useState } from "react";
import GenerateIntroForm from "@/app/dashboard/super/GenerateIntroForm";

const GenerateIntroDialog = ({ userEmail }: { userEmail: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"secondary"}>
            <BadgeDollarSign className="mr-2 h-4 w-4" />
            Generate Intro to ANYONE
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Intro</DialogTitle>
            <DialogDescription>
              A Super can use this to generate an intro to anyone.
            </DialogDescription>
          </DialogHeader>
          <GenerateIntroForm userEmail={userEmail} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateIntroDialog;
