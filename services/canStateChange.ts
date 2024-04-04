import { IntroStates } from "@/lib/introStates";
import { Introduction } from "@prisma/client";
import prisma from "@/prismaClient";

// todo
// when user clicks approve we move to approved or pending credits
// when user gains more credits, we will take its pending credit ones & move them to approved
// when it is approved we pickup & send email

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
  "email sent": [],
  rejected: [],
  cancelled: [],
  expired: [],
};

type CanStateChange = (
  existingState: IntroStates,
  newDesiredState: IntroStates,
) => boolean;

const canStateChange: CanStateChange = (
  existingState,
  newDesiredState,
) => {
  console.log(existingState, newDesiredState, transitions[existingState].includes(newDesiredState))
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
  const doIt = await canStateChange(intro.status as IntroStates, newDesiredState);
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
