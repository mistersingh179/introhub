"use client";

import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { PartyPopper, SkipForward, SquarePen, Star } from "lucide-react";
import * as React from "react";
import wantToMeetAction from "@/app/actions/contacts/wantToMeetAction";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type WantToNotMeetFormProps = {
  contactId: string;
};

const WantToNotMeetForm = (props: WantToNotMeetFormProps) => {
  const { contactId } = props;
  const action = wantToMeetAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <form action={dispatch}>
        <input type={"hidden"} name={"desire"} value={"false"} />
        <input type={"hidden"} name={"contactId"} value={contactId} />
        <input
          type={"hidden"}
          name={"callbackUrl"}
          value={`${pathname}?${searchParams}`}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SubmitButton
                variant={"outline"}
                size={"icon"}
                label={<Star color={"rgb(147 51 234)"} />}
              />
            </TooltipTrigger>
            <TooltipContent className={"w-64"}>
              Remove the Star if you no longer want to prioritize this intro.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </>
  );
};

export default WantToNotMeetForm;
