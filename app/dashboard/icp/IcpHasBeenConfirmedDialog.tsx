import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import * as React from "react";

const IcpHasBeenConfirmedDialog = ({disabled}: {disabled: boolean}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={true}>
        <Button disabled={disabled} variant={"primary"}>Confirm ICP</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Your ICP has been successfully recorded 🥳
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sit back, relax and await introductions in your mailbox 🎉. We will
            now start reaching out to prospects which match your ICP. If they
            show interest in taking a meeting wit you, we will introduce you
            both via email. Look out for intro emails, as
            {"you'll"} be {"cc'd"} when a target consents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IcpHasBeenConfirmedDialog;
