import prisma from "../prismaClient";
import { Contact } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log("***");
  // console.log(query, params);
  // console.log("***");
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("Hello world");
  const account = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        name: {
          contains: "sandeep",
          mode: "insensitive",
        },
      },
    },
  });
  const gmail = await getGmailObject(account);
  const profile = await gmail.users.getProfile({
    userId: "me",
  });
  console.log("profile ", profile);
})();

export {};
