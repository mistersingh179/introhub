"use client";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { signOutAction } from "@/app/actions/auth";

const MissingPermissionsDialog = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Google Permissions Not Found!</AlertDialogTitle>
            <AlertDialogDescription>
              We are unable to find the required google permissions. Please
              consider logging out and then logging back in while granting us
              the required permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Never mind & continue anyway
            </AlertDialogCancel>
            <form action={signOutAction}>
              <Button type={"submit"} className={"w-full"} autoFocus={true}>
                Continue to Log out
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MissingPermissionsDialog;
