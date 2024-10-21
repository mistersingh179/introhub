import prisma from "../prismaClient";
import getGmailObject from "@/services/helpers/getGmailObject";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
    },
    include: {
      accounts: true,
    },
  });

  console.log("accounts: ", user.accounts.length);
  let account = user.accounts[0];
  console.log(account.scope);

  const gmail = await getGmailObject(account);

  // console.log("stopping watch");
  // const stopResponse = await gmail.users.stop({
  //   userId: 'me'
  // });
  // console.log(stopResponse);

  console.log("starting watch!");
  const watchResponse = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: "projects/introhub-development/topics/introhub-develoment",
    },
  });

  console.log(watchResponse);
})();

export {};
