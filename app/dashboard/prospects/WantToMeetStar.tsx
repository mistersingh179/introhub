"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  WantsToMeetApiRequestBody,
  WantsToMeetApiResponseBody,
} from "@/app/api/contacts/[id]/wantsToMeet/route";
import { ContactWithUserAndIsWanted } from "@/app/dashboard/prospects/page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast as toastSooner } from "sonner";

type WantToMeetStarProps = {
  contact: ContactWithUserAndIsWanted;
};

const WantToMeetStar = (props: WantToMeetStarProps) => {
  const { contact } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [desired, setDesired] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    console.log("on load setting correct isWanted: ", contact.isWanted);
    setDesired(contact.isWanted);
    setLoading(false);
  }, [contact.isWanted]);

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    evt,
  ) => {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/contacts/${contact.id}/wantsToMeet`;
    const requestBody: WantsToMeetApiRequestBody = {
      desire: !desired,
    };
    console.log("updating wantedBy for: ", contact.id, " to: ", !desired);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = (await res.json()) as WantsToMeetApiResponseBody;
      console.log("got response: ", data);
      if (desired) {
        // old value
        toastSooner("Prospect star has been removed");
      } else {
        toastSooner("Prospect has been stared");
      }
      setDesired(!desired);
    } catch (err) {
      console.log(
        "error while updating prospect wantedBy status to ",
        !desired,
      );
      toastSooner.error("Unable to update prospect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={clickHandler}
              variant={"outline"}
              size={"icon"}
              disabled={loading}
            >
              {desired && <Star color={"rgb(147 51 234)"} />}
              {!desired && <Star />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className={"w-64"}>
            {desired && (
              <>
                Remove the Star if you no longer want to prioritize this intro.
              </>
            )}
            {!desired && (
              <>
                Star a Prospect to further define your ICP and prioritize an
                intro to them.
              </>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default WantToMeetStar;
