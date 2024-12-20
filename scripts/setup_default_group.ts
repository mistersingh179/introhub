import prisma from "@/prismaClient";
import { Prisma } from "@prisma/client";
import { PlatformGroupName } from "@/app/utils/constants";
import doWeHaveFullScope from "@/services/doWeHaveFullScope";
import refreshScopes from "@/services/refreshScopes";

(async () => {
  // try {
  //   await prisma.group.create({
  //     data: {
  //       name: PlatformGroupName,
  //       description:
  //         "This is the Platform group which includes everyone who Rod has vetted.",
  //       creator: {
  //         connect: {
  //           email: "rod@introhub.net",
  //         },
  //       },
  //     },
  //   });
  // } catch (err) {
  //   if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //     console.log("got error: ", err.code, err.meta);
  //   } else {
  //     console.log("got unknown error: ", err);
  //   }
  // }

  const platformGroup = await prisma.group.findFirstOrThrow({
    where: {
      name: PlatformGroupName,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      // agreedToAutoProspecting: true,
      // missingPersonalInfo: false,
    },
    include: {
      accounts: true,
      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });
  for (const user of users) {
    if (user._count.memberships === 0) {
      try {
        await refreshScopes(user.id);
        const fullScopeFound = doWeHaveFullScope(user.accounts);
        console.log("no membership found: ", user.email, fullScopeFound);
        await prisma.membership.create({
          data: {
            groupId: platformGroup.id,
            userId: user.id,
            approved: true,
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          console.log("got error: ", err.code, err.meta);
        } else {
          console.log("got unknown error: ", err);
        }
      }
    }
  }
})();
