"use client";

import { Button } from "@/components/ui/button";

import * as React from "react";
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
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import { Input } from "@/components/ui/input";

type AutoProspectingDialogProps = {
  agreedToAutoProspecting: boolean;
};

const AutoProspectingDialog = (props: AutoProspectingDialogProps) => {
  const { agreedToAutoProspecting } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(agreedToAutoProspecting === false);
  }, [agreedToAutoProspecting]);

  const [errorMessage, dispatch] = useFormState(
    acceptAutoProspectingAction,
    undefined,
  );

  const listItemClasses = {
    listStyle: "outside",
    marginLeft: "1em",
    marginBottom: "1em",
  };

  const headingClasses = {
    margin: "1em 0",
    fontWeight: "bold",
    fontSize: "medium",
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          className={"w-full max-w-4xl max-h-[95vh] overflow-y-auto"}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to IntroHub 2.0 🎉 </AlertDialogTitle>
            <AlertDialogDescription className={"text-left"}>
              <div>
                We aim to get you more meetings per month with target prospects.
                To accomplish this goal, we automated intro requests and
                approvals. {"Here's"} what you need to know.
              </div>
              <h2 style={headingClasses}>Introduction Requests</h2>
              <div className="mt-4">
                <ul>
                  <li style={listItemClasses}>
                    We automatically handle prospecting for you based on your
                    Ideal Customer Profile (ICP). Set your ICP by saving filters
                    and starring profiles on the Prospects page.
                  </li>
                  <li style={listItemClasses}>
                    Each day, {"we'll"} request an intro to prospects that match
                    your ICP.
                  </li>
                  <li style={listItemClasses}>
                    If a prospect consents, then {"you'll"} be {"CC'd"} on an
                    intro email so you can forge a relationship.
                  </li>
                </ul>
              </div>
              <h2 style={headingClasses}>Facilitating Introductions</h2>
              <div className="mt-4">
                <ul>
                  <li style={listItemClasses}>
                    When one of your contacts matches a requester’s ICP, we’ll
                    send an email on your behalf to ask if {"they're"} open to
                    an introduction.
                  </li>
                  <li style={listItemClasses}>
                    Only with their explicit approval will we facilitate the
                    connection to ensure respect and privacy.
                  </li>
                  <li style={listItemClasses}>
                    {"You're"} in control. Make any contact {"'Unavailable'"}{" "}
                    for intros in the Contacts page.
                  </li>
                </ul>
              </div>
              <h2 style={headingClasses}>Safeguarding Your Reputation</h2>
              <div className="mt-4">
                <ul>
                  <li style={listItemClasses}>
                    To prevent contact fatigue, we limit emails to one per
                    person every 7 days.
                  </li>
                  <li style={listItemClasses}>
                    Your account will never send more than two intro requests
                    per day.
                  </li>
                </ul>
              </div>
              <div className="mt-4">
                Ready to get started? Opt in now and begin connecting with
                prospects!
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sticky bottom-0">
            <ShowChildren showIt={!!errorMessage}>
              <ErrorMessage
                description={JSON.stringify(errorMessage, null, 2)}
              />
            </ShowChildren>
            <form action={dispatch}>
              <Input type={"hidden"} name={"agreed"} value={"true"} />
              <Button type={"submit"} className={"w-full"} autoFocus={true}>
                Start Using IntroHub 2.0
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AutoProspectingDialog;
