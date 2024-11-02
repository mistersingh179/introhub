"use client";

import { Label } from "@/components/ui/label";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import updateIcpDescriptionAction from "@/app/actions/user/updateIcpDescriptionAction";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

export default function UpdateIcpForm(props: {
  icpDescription: string | undefined;
}) {
  const { icpDescription } = props;
  const action = updateIcpDescriptionAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);

  return (
    <form action={dispatch} className={"max-w-2xl flex flex-col gap-6"}>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>

      <div className={"flex flex-col gap-4"}>
        <div className={"flex flex-row gap-2 items-center"}>
          <Label htmlFor={"icpDescription"}>Define Your ICP</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={"20"} />
              </TooltipTrigger>
              <TooltipContent
                side={"right"}
                sideOffset={10}
                className={'sm:max-w-sm md:max-w-xl'}
              >
                <TooltipArrow width={16} height={10} className="fill-current" />
                <strong>ICP Examples:</strong>
                <ul className="my-4 ml-6 list-disc text-sm font-light italic leading-normal">
                  <li>
                    Software engineers in San Francisco with cloud computing experience, open to discussing AI.
                  </li>
                  <li>
                    Founders or CEOs in small to medium-sized health tech companies focusing on digital health solutions.
                  </li>
                  <li>
                    Senior marketing professionals skilled in content strategy and SEO, working in e-commerce or retail.
                  </li>
                  <li>
                    Developers in SaaS using Python, with machine learning experience in financial services.
                  </li>
                  <li>
                    Product managers in the European automotive sector working on electric vehicles and sustainability.
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Textarea
          name={"icpDescription"}
          placeholder={
            "Describe your ICP here, like: Part-time cold-callers in financial startups."
          }
          className={"w-full"}
          defaultValue={icpDescription}
          onKeyDown={(evt) => {
            if (evt.key === "Enter" && evt.metaKey) {
              evt.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <p className={"text-sm text-muted-foreground"}>
          Tip: Press Cmd+Enter to Submit
        </p>
      </div>

      <div className={"flex flex-row justify-center mt-4"}>
        <SubmitButton label={"Submit"} className={"w-fit"} />
      </div>
    </form>
  );
}
