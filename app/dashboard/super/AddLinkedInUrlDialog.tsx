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
import {BadgeDollarSign, Linkedin, Pencil} from "lucide-react";
import EditFiltersForm from "@/app/dashboard/prospects/EditFiltersForm";
import React, { useState } from "react";
import AddCreditsForm from "@/app/dashboard/super/AddCreditsForm";
import AddLinkedInUrlForm from "@/app/dashboard/super/AddLinkedInUrlForm";

const AddLinkedInUrlDialog = ({ userEmail }: { userEmail: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'destructive'}>
            <Linkedin className="mr-2 h-4 w-4"/>
            Add LinkedInUrl
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add LinkedInUrl</DialogTitle>
            <DialogDescription>
              Manually connect this users email address to a linkedInUrl
            </DialogDescription>
          </DialogHeader>
          <AddLinkedInUrlForm userEmail={userEmail} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddLinkedInUrlDialog;
