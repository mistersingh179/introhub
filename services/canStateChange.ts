import { IntroStates } from "@/lib/introStates";
import { Introduction } from "@prisma/client";
import prisma from "@/prismaClient";

/*
Here is how it works:

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
  draft: [
    IntroStates["pending approval"],
    IntroStates.cancelled,
    IntroStates.expired,
  ],
  "pending approval": [
    IntroStates.approved,
    IntroStates["pending credits"],
    IntroStates.rejected,
    IntroStates.expired,
    IntroStates.cancelled,
  ],
  approved: [IntroStates["email sent"]],
  "pending credits": [
    IntroStates.approved,
    IntroStates.rejected,
    IntroStates.cancelled,
    IntroStates.expired,
  ],
  "email sent": [IntroStates["email opened"]],
  "email opened": [],
  rejected: [],
  cancelled: [],
  expired: [],
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
