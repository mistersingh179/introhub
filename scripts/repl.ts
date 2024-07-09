import prisma from "../prismaClient";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { IntroStates } from "@/lib/introStates";
import getGmailObject from "@/services/helpers/getGmailObject";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  const users = await prisma.user.findMany({
    where: {
      accounts: {
        some: {
          provider: "google",
        },
      },
    },
    include: {
      accounts: true,
    },
  });
  const result: { [key: string]: boolean } = {};
  // const result2: Record<string, boolean> = {};

  for (const user of users) {
    const account = user.accounts[0];
    try {
      const gmail = await getGmailObject(account);
      console.log("got gmail object for: ", user.email);
      result[user.email!] = true;
    } catch (err) {
      console.log("failed to gmail object for: ", user.email);
      result[user.email!] = false;
    }
  }
  console.table(result);
})();

export {};
