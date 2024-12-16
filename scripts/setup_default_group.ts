import prisma from "@/prismaClient";
import { Prisma } from "@prisma/client";
import { PlatformGroupName } from "@/app/utils/constants";

(async () => {
  try {
    await prisma.group.create({
      data: {
        name: PlatformGroupName,
        description:
          "This is the Platform group which includes everyone who Rod has vetted.",
        creator: {
          connect: {
            email: "rod@introhub.net",
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("got error: ", err.code, err.meta);
    } else {
      console.log("got unknown error: ", err);
    }
  }

  // const platformGroup = await prisma.group.findFirstOrThrow({
  //   where: {
  //     name: PlatformGroupName,
  //   },
  // });
  //
  // const users = await prisma.user.findMany();
  // for (const user of users) {
  //   try {
  //     await prisma.membership.create({
  //       data: {
  //         groupId: platformGroup.id,
  //         userId: user.id,
  //         approved: true,
  //       },
  //     });
  //   } catch (err) {
  //     if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //       console.log("got error: ", err.code, err.meta);
  //     } else {
  //       console.log("got unknown error: ", err);
  //     }
  //   }
  // }
})();
