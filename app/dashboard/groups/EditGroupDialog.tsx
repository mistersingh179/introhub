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
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import EditGroupForm from "@/app/dashboard/groups/EditGroupForm";
import { Group } from "@prisma/client";

type EditGroupDialogProps = {
  group: Group;
};

const EditGroupDialog = (props: EditGroupDialogProps) => {
  const {group} = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'secondary'}>
            <Pencil size={18} className={"mr-2"} />
            Edit Group
          </Button>
        </DialogTrigger>
        <DialogContent className="xs:max-w-[425px] md:max-w-xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit group</DialogTitle>
            <DialogDescription>
              Use this form to update your group information of yours.
            </DialogDescription>
          </DialogHeader>
          <EditGroupForm setOpen={setOpen} group={group} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditGroupDialog;
