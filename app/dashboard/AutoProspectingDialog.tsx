"use client";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import acceptAutoProspectingAction from "@/app/actions/user/acceptAutoProspectingAction";

type AutoProspectingDialogProps = {
  agreedToAutoProspecting: boolean;
};

const AutoProspectingDialog = (props: AutoProspectingDialogProps) => {
  const { agreedToAutoProspecting } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(agreedToAutoProspecting === false);
  }, [agreedToAutoProspecting]);

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className={"w-full max-w-4xl"}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              🚀 🎉 🙌 IntroHub 2.0 is here 🚀 🎉 🙌{" "}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                Introhub 2.0 now{" "}
                <span className={"font-semibold"}>auto prospects</span> and only
                makes <span className={"font-semibold"}>double opt-in</span>{" "}
                introductions.
              </div>
              <div className={"mt-4"}>
                As a <span className={"font-semibold"}>requester</span> of
                introductions, based on your ICP determined by your saved
                filters and starred prospects, we automatically prospect for you
                and request 1 introduction every day for you. This means that an
                email is sent from the user who knows your prospect, asking
                them, the prospect, if they would like to be introduced to you.
                If they say yes, then an email is sent from the facilitator
                introducing you to the prospect. You will be {"cc'd"} on this
                email and are expected to then take the conversation from there,
                building your relationship, closing the deal & bringing it home
                💪.
              </div>
              <div className={"mt-4"}>
                As a <span className={"font-semibold"}>facilitator</span> of
                introductions, if and when your contacts match a requesters ICP,
                we automatically send an email on your behalf to your contact
                asking them if it is cool for them to be introduced to the
                requester. If they{" "}
                <span className={"font-semibold"}>explicitly say yes</span> I
                would like to be introduced,{" "}
                <span className={"font-semibold"}>then and only then</span> do
                we introduce them to the requester.
              </div>
              <div className={"mt-4"}>
                We have rules in place so that a contact is emailed to take an
                intro{" "}
                <span className={"font-semibold"}>
                  no more than once every 7 days
                </span>
                . And we will ask{" "}
                <span className={"font-semibold"}>
                  no more than 2 contacts per day
                </span>{" "}
                to take an intro. This ensures that none of your contact are
                burdened with too many intro requests.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <form action={acceptAutoProspectingAction}>
              <Button type={"submit"} className={"w-full"} autoFocus={true}>
                I understand & want to use Introhub 2.0
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AutoProspectingDialog;
