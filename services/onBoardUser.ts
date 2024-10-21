import MediumQueue, { mediumQueueEvents } from "@/bull/queues/mediumQueue";
import prisma from "@/prismaClient";
import ApolloQueue from "@/bull/queues/apolloQueue";
import {setupMailboxWatch} from "@/services/setupMailboxWatchOnAllAccounts";

export type OnBoardUserInput = {
  userId: string;
};
type OnBoardUser = (input: OnBoardUserInput) => Promise<void>;

const onBoardUser: OnBoardUser = async (input) => {
  const { userId } = input;
  console.log("in onBoardUser job with: ", userId);

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      accounts: true,
    },
  });
  const email = user.email!;
  const account = user.accounts[0];

  await ApolloQueue.add("enrichContactUsingApollo", email);

  const downloadMessagesJob = await MediumQueue.add("downloadMessages", {
    account: account,
  });
  await downloadMessagesJob.waitUntilFinished(mediumQueueEvents, 5 * 60 * 1000);

  // using delay to wait for the downloadMetaData job
  // using priority to run after downloadMetaData job
  // downloadMetaData job is started internally by the downloadMessages Job

  // todo - use Queue#getJobs to ensure that downloadMetaData has finished
  const buildContactsJob = await MediumQueue.add("buildContacts", user, {
    delay: 60 * 1000,
    priority: 10,
  });
  await buildContactsJob.waitUntilFinished(mediumQueueEvents, 5 * 60 * 1000);

  const contacts = await prisma.contact.findMany({
    where: {
      userId: user.id,
    },
  });
  for (const contact of contacts) {
    await ApolloQueue.add("enrichContactUsingApollo", email);
  }
  await setupMailboxWatch({...account, user: user})
};

export default onBoardUser;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "mistersingh179@gmail.com",
      },
    });
    await onBoardUser({
      userId: user.id,
    });
    process.exit(0);
  })();
}
