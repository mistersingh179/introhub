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
import SaveFiltersForm from "@/app/dashboard/prospects/SaveFiltersForm";
import { useState } from "react";

const SaveFiltersDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className={"w-full"}>
            Save Filter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Filter</DialogTitle>
            <DialogDescription>
              Give a name and save this filter so you can easily access it next
              time.
            </DialogDescription>
          </DialogHeader>
          <SaveFiltersForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SaveFiltersDialog;
