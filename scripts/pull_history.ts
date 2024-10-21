import getGmailObject from "@/services/helpers/getGmailObject";
import prisma from "@/prismaClient";

(async () => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
    },
    include: {
      accounts: true,
    },
  });
  let account = user.accounts[0];

  const gmail = await getGmailObject(account);

  const historyId = '582120';

  const historyResult = await gmail.users.history.list({
    userId: "me",
    startHistoryId: historyId,
  });

  console.log("historyResult: ");
  console.dir(historyResult.data, {depth: 5});

})()