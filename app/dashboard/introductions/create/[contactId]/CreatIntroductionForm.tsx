"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import createIntroductionAction from "@/app/actions/introductions/createIntroductionAction";
import { TypographyMuted } from "@/components/TypographyMuted";
import {CompanyProfile, PersonExperience, PersonProfile, User} from "@prisma/client";
import {
  ContactWithUser,
  PersonProfileWithExperiences,
} from "@/app/dashboard/introductions/create/[contactId]/page";

export default function CreateIntroductionForm({
  contact,
  personProfile,
  personExperience,
  companyProfile,
  user,
}: {
  contact: ContactWithUser;
  personProfile: PersonProfile;
  personExperience: PersonExperience;
  companyProfile: CompanyProfile;
  user: User;
}) {
  const params = useParams<{ contactId: string }>();
  const action = createIntroductionAction.bind(null, params.contactId);
  const [errorMessage, dispatch] = useFormState(action, undefined);

  const facilitatorName = contact.user.name;
  const contactName = personProfile.fullName;
  const contactCompanyName = personExperience.companyName;
  const contactCompanyIndustry = companyProfile.industry;
  const requesterName = user.name;

  const defaultMessageForFacilitator = `Hi ${facilitatorName}, I noticed you're connected to ${contactName} at ${contactCompanyName}. I'm really impressed by their work in ${contactCompanyIndustry} and believe my **[Product/Service]** could offer them great value, particularly in **[Specific Area]**. I'd greatly appreciate your help in facilitating an intro.
`;

  const defaultMessageForContact = `Hi ${contactName}, I'd like to introduce you to ${requesterName}, who has experience in ${contactCompanyIndustry}. They're interested in discussing **[Topic]** with you, believing it could offer valuable insights for your current projects.

- ${facilitatorName}

cc: ${requesterName}, please take it from here.`;

  return (
    <>
      <form
        action={dispatch}
        className={"bg-gray-50 dark:bg-slate-950 p-4 flex flex-col gap-6"}
      >
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}
        <div className={"flex flex-col md:flex-row gap-12 justify-evenly"}>
          <div className={"flex flex-col gap-6 items-center md:w-1/2"}>
            <Label>Message For Facilitator</Label>
            <Textarea
              rows={15}
              name="messageForFacilitator"
              id="messageForFacilitator"
              defaultValue={defaultMessageForFacilitator}
            />
            <TypographyMuted className={"text-center"}>
              Explain the value you see in being introduced to {contactName},
              and how you might offer value to them. Be concise and clear.
            </TypographyMuted>
          </div>

          <div className={"flex flex-col gap-6 items-center md:w-1/2"}>
            <Label>Message For Contact</Label>
            <Textarea
              rows={15}
              name="messageForContact"
              id="messageForContact"
              defaultValue={defaultMessageForContact}
            />
            <TypographyMuted className={"text-center"}>
              Ghost write an introduction from the Facilitator to the Prospect.
              Highlight what makes your request relevant to {contactName}.
              Think about what you can offer or discuss that aligns with their
              interests.
            </TypographyMuted>
          </div>
        </div>

        <div className={"flex flex-row justify-center"}>
          <SubmitButton label={"Create Introduction"} />
        </div>
      </form>
    </>
  );
}
