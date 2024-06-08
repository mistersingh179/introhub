import { User } from "@prisma/client";
import prisma from "@/prismaClient";

const removeCreditsFromUser = async (user: User, amount: number) => {
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      credits: {
        decrement: amount,
      },
    },
  });
};

export default removeCreditsFromUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    await removeCreditsFromUser(user, 1);
  })();
}
