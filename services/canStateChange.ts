import { IntroStates } from "@/lib/introStates";
import { Introduction } from "@prisma/client";
import prisma from "@/prismaClient";

/*
How it works in v2.0 Latest

At db level default state value is "draft"

We automatically generate an introduction in – generateAnIntroduction.ts
  -> intro is created in "pending approval" state

Then we immediately send an email asking permission – sendAskingPermissionToMakeIntroEmail.ts
  -> upon sending email successfully we put intro in "permission email sent" state
  -> upon failing to send email we put intro in "permission email send failure" state

If email is opened – api/intros/[id]/opened/route.ts
  -> we update intro to "permission email opened" state
  -> this only happens if in "permission email sent" state and not from any other state.

If intro is approved – api/intros/[id]/approve/route.ts
  -> we update intro to "approved" state

Then we immediately send an email introducing both parties – sendIntroducingBothEmail.ts
  -> we update intro to "introducing email sent"

If intro is rejected – api/intros/[id]/reject/route.ts
  -> we update intro to "rejected" state



*/

/*
Here is how it works v1.0 (Original):

when requester clicks on "create intro" in the UI – createIntroductionAction.ts
  -> intro is update to "pending approval"
  -> email is sent to facilitator – sendPendingApprovalEmail.ts

when facilitator clicks on "approve" in the UI – approveIntroAction.ts
 -> if facilitator updated the pre-draft message, then update it
 -> if requester has money, then update it to "approved".
 -> if requester does not have money update it to "pending credit"
 -> always take 1 credit from requester & give 1 credit to facilitator.
 -> after getting credits if facilitator's own credit balance becomes positive:
    -> then we take its own "pending credit" intros and move them to "approved".

Daily Cron Job – sendEmailForAllApprovedIntros
 -> to go over all introductions which are approved and send those emails.

Note:
Credit is paid by requester when its intro is approved.
This is also when the facilitator got the credit.
Intro is put in "pending credit" state temporarily since balance of requester is negative.
the second balance is not negative we will change state from "pending credit" to "approved"
at this later time no credits exchange hands, as that has already happened.
*/

type Transitions = {
  [key in IntroStates]: IntroStates[];
};

const transitions: Transitions = {
  draft: [IntroStates["pending approval"], IntroStates.cancelled],
  "pending approval": [
    IntroStates["permission email sent"],
    IntroStates["permission email send failure"],
    IntroStates.cancelled,
  ],
  "permission email sent": [
    IntroStates["permission email opened"],
    IntroStates.approved,
    IntroStates.rejected,
  ],
  "permission email opened": [IntroStates.approved, IntroStates.rejected],
  "permission email send failure": [IntroStates["permission email sent"]],
  approved: [
    IntroStates["introducing email sent"],
    IntroStates["introducing email send failure"],
  ],
  rejected: [
    IntroStates.approved
  ],
  cancelled: [],
  "introducing email sent": [],
  "introducing email send failure": [IntroStates["introducing email sent"]],
};

type CanStateChange = (
  existingState: IntroStates,
  newDesiredState: IntroStates,
) => boolean;

const canStateChange: CanStateChange = (existingState, newDesiredState) => {
  console.log(
    existingState,
    newDesiredState,
    transitions[existingState].includes(newDesiredState),
  );
  return transitions[existingState].includes(newDesiredState);
};

export const goingToChangeIntroStatus = async (
  introductionId: string,
  newDesiredState: IntroStates,
): Promise<void> => {
  const intro: Introduction = await prisma.introduction.findFirstOrThrow({
    where: {
      id: introductionId,
    },
  });
  const doIt = canStateChange(intro.status as IntroStates, newDesiredState);
  if (!doIt) {
    throw new Error(
      `Intro State can not be changed from ${intro.status} to ${newDesiredState}`,
    );
  }
};

export default canStateChange;

if (require.main === module) {
  (async () => {
    const ans = await goingToChangeIntroStatus(
      "clulgaod1000getzq4koex9yt",
      IntroStates.approved,
    );
    console.log("ans: ", ans);
  })();
}
