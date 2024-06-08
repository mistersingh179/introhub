import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";

type CreditsBadgeProps = {
  credits: number;
};
const CreditsBadge = (props: CreditsBadgeProps) => {
  const { credits } = props;
  return (
    <>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={"secondary"}>Credits: {credits}</Badge>
            </TooltipTrigger>
            <TooltipContent className={"w-64"}>
              You currently have {credits} credit
              {credits === 1 ? "" : "s"}. You will earn 1 credit by approving
              someone {`else's`} intro request and you will spend 1 credit when
              one of your introduction requests is approved & emailed out.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default CreditsBadge;
