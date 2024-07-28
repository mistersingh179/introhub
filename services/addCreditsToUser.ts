import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import moveIntroToBeApproved from "@/services/moveIntroToBeApproved";
import { IntroStates } from "@/lib/introStates";
import removeCreditsFromUser from "@/services/removeCreditsFromUser";

const addCreditsToUser = async (user: User, amount: number) => {
  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      credits: {
        increment: amount,
      },
    },
  });
  return user;
};

export default addCreditsToUser;

if (require.main === module) {
  (async () => {
    let user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    await addCreditsToUser(user, 2);
  })();
}
