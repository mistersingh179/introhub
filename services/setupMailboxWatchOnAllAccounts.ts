import prisma from "@/prismaClient";
import mediumQueue from "@/bull/queues/mediumQueue";
import getGmailObject from "@/services/helpers/getGmailObject";
import { Account, User } from "@prisma/client";
import {allowedEmailsForTesting} from "@/app/utils/constants";

type SetupMailboxWatchOnAllAccounts = () => Promise<void>;

export const setupMailboxWatch = async (account: Account & { user: User }) => {
  const gmail = await getGmailObject(account);

  console.log("starting watch for: ", account.user.email);
  const watchResponse = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: process.env.TOPIC_NAME,
    },
  });

  console.log("watchResponse: ", account.user.email, watchResponse.status, watchResponse.data);
};

const setupMailboxWatchOnAllAccounts: SetupMailboxWatchOnAllAccounts =
  async () => {
    const accounts = await prisma.account.findMany({
      where: {
        user: {
          email: {
            in: allowedEmailsForTesting
          }
        }
      },
      include: {
        user: true,
      },
    });
    console.log("accounts: ", accounts.length);
    for (const account of accounts) {
      try {
        console.log("processing: ", account.user.email)
        await setupMailboxWatch(account);
      } catch (err) {
        console.log("error setupMailboxWatch: ", account.user.email, err);
      }
    }
  };

export default setupMailboxWatchOnAllAccounts;

if (require.main === module) {
  (async () => {
    await setupMailboxWatchOnAllAccounts()
  })();
}