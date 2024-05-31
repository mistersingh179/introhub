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
import React, { useState } from "react";
import { Filters } from "@prisma/client";
import EditFiltersForm from "@/app/dashboard/prospects/EditFiltersForm";
import {Pencil} from "lucide-react";

type EditFiltersDialogProps = {
  filtersObj: Filters;
};

const EditFiltersDialog = (props: EditFiltersDialogProps) => {
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
            <Pencil size={"10"} strokeWidth={'2'} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Filter</DialogTitle>
            <DialogDescription>
              Update name or email options on your filter.
            </DialogDescription>
          </DialogHeader>
          <EditFiltersForm setOpen={setOpen} filtersObj={filtersObj} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditFiltersDialog;
