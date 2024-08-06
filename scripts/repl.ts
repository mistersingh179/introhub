import prisma from "../prismaClient";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { IntroStates } from "@/lib/introStates";
import getGmailObject from "@/services/helpers/getGmailObject";
import { startOfToday, subDays } from "date-fns";
import sendEmail from "@/services/emails/sendEmail";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
      accounts: {
        some: {
          provider: "google",
        },
      },
    },
    include: {
      accounts: {
        where: {
          provider: "google",
        },
      },
    },
  });
  console.log("user: ", user.accounts.length);

  let ans:any = await prisma.wantedContact.count({
    where: {
      userId: user.id
    }
  });
  console.log('ans: ', ans);

  ans = await prisma.wantedContact.findMany({
    where: {
      userId: user.id
    },
    include: {
      contact: true
    }
  })
  console.log('ans: ', ans);


  // const gmail = await getGmailObject(user.accounts[0]);
  //
  // const ans = await gmail.users.messages.modify({
  //   userId: "me",
  //   id: '19109bae21f4aa7e',
  //   requestBody:{
  //     "removeLabelIds": [
  //       "inbox"
  //     ]
  //   }
  // });

})();

export {};
