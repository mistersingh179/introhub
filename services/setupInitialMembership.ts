import { User } from "@prisma/client";
import prisma from "@/prismaClient";
import { PlatformGroupName } from "@/app/utils/constants";

const setupInitialMembership = async (user: User, groupName: string) => {
  console.log("in setupInitialMembership with: ", user.email, groupName);

  if (groupName === PlatformGroupName) {
    console.log("in setupInitialMembership with platform group name");
    const existingMembershipsCount = await prisma.membership.count({
      where: {
        userId: user.id,
      },
    });
    if (existingMembershipsCount > 0) {
      console.log("bail as already have memberships", existingMembershipsCount);
      return;
    }
  }

  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      group: {
        name: groupName,
      },
    },
    include: {
      group: true,
    },
  });

  if (existingMembership) {
    console.log("membership already exists. bailing!", user.email, groupName);
  } else {
    try {
      await prisma.membership.create({
        data: {
          group: {
            connect: {
              name: groupName,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          approved: groupName === PlatformGroupName,
        },
      });
    } catch (err) {
      console.log("*** got error while creating membership: ", err);
    }
  }
};

export default setupInitialMembership;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "mistersingh179@gmail.com",
      },
    });
    await setupInitialMembership(user, "");
  })();
}
