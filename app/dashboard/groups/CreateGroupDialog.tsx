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
import { BadgePlus } from "lucide-react";
import React, { useState } from "react";
import CreateGroupForm from "@/app/dashboard/groups/CreateGroupForm";

const CreateGroupDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <BadgePlus size={18} className={"mr-2"} />
            Create New Group
          </Button>
        </DialogTrigger>
        <DialogContent className="xs:max-w-[425px] md:max-w-xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create a new group</DialogTitle>
            <DialogDescription>
              Use this form to create a new group of yours. Members of your
              group will be able to share contacts with each-other.
            </DialogDescription>
          </DialogHeader>
          <CreateGroupForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateGroupDialog;
