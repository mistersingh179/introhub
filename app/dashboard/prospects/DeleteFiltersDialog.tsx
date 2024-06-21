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
import { Filters } from "@prisma/client";
import DeleteFiltersForm from "@/app/dashboard/prospects/DeleteFiltersForm";
import { X } from "lucide-react";

type DeleteFiltersDialogProps = {
  filtersObj: Filters;
};

const DeleteFiltersDialog = (props: DeleteFiltersDialogProps) => {
  const { filtersObj } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            className={"ml-2 w-6 h-6 rounded-full"}
          >
            <X size={"10"} strokeWidth={"2"} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Filter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this filter?
            </DialogDescription>
          </DialogHeader>
          <DeleteFiltersForm setOpen={setOpen} filtersObj={filtersObj} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteFiltersDialog;
