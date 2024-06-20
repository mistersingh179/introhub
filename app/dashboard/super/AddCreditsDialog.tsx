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
import { BadgeDollarSign, Pencil } from "lucide-react";
import EditFiltersForm from "@/app/dashboard/prospects/EditFiltersForm";
import React, { useState } from "react";
import AddCreditsForm from "@/app/dashboard/super/AddCreditsForm";

const AddCreditsDialog = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'secondary'}>
            <BadgeDollarSign className="mr-2 h-4 w-4" />
            Add Credits
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>
              Type in how many credits you want to give
            </DialogDescription>
          </DialogHeader>
          <AddCreditsForm userId={userId} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCreditsDialog;
