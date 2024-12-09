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
import { X } from "lucide-react";
import React, { useState } from "react";
import DeleteGroupForm from "@/app/dashboard/groups/DeleteGroupForm";
import { Group } from "@prisma/client";

const DeleteGroupDialog = ({ group }: { group: Group }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>
            <X size={18} className={"mr-2"} />
            Delete Group
          </Button>
        </DialogTrigger>
        <DialogContent className="xs:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this group? This will disconnect
              all memberships of users to this group.
            </DialogDescription>
          </DialogHeader>
          <DeleteGroupForm setOpen={setOpen} group={group} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteGroupDialog;
