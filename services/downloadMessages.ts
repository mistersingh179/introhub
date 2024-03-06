import prisma from "@/prismaClient";
import { Account, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import MessageCreateManyInput = Prisma.MessageCreateManyInput;
import MediumQueue from "@/bull/queues/mediumQueue";
import { subHours } from "date-fns";
import bulkInsertMessages, {
  BulkInsertMessageInput,
} from "@/services/helpers/queries/bulkInsertMessages";

export type DownloadMessagesOutput = {
  insertCount: number;
  nextJobId: string | undefined;
};

export type DownloadMessagesInput = {
  account: Account;
  pageToken?: string;
};

type DownloadMessages = (
  input: DownloadMessagesInput,
) => Promise<DownloadMessagesOutput>;

const downloadMessages: DownloadMessages = async (input) => {
  const { account, pageToken } = input;
  const gmail = await getGmailObject(account);

  const { data } = await gmail.users.messages.list({
    userId: "me",
    maxResults: 500,
    // q: 'to: sandeep@brandweaver.ai',
    pageToken,
    includeSpamTrash: false,
  });

  const { messages, nextPageToken } = data;

  const messagesPayload: BulkInsertMessageInput[] = [];
  for (const message of messages || []) {
    messagesPayload.push({
      userId: account.userId,
      id: message.id as string,
      threadId: message.threadId!,
    });
  }

  const insertedIds = await bulkInsertMessages(messagesPayload);
  console.log("messages insert result: ", insertedIds.length);

  for (const insertedId of insertedIds) {
    const jobObj = await MediumQueue.add("downloadMetaData", {
      messageId: insertedId,
      account: account,
    });
    const { id, name } = jobObj;
    console.log("schedule job to download message metaData: ", id, name);
  }

  const recentMessageInsertCount = await prisma.message.count({
    where: {
      userId: account.userId,
      createdAt: {
        gt: subHours(new Date(), 12)
      }
    },
  });
  if (recentMessageInsertCount >= 50_000) {
    console.log("stopping download of messages as reached daily limit");
    return { insertCount: insertedIds.length, nextJobId: undefined };
  }

  if(nextPageToken){
    const jobObj = await MediumQueue.add("downloadMessages", {
      account: account,
      pageToken: nextPageToken,
    });
    const { id, name } = jobObj;
    console.log("schedule job to download next set of messages: ", id, name, nextPageToken);
    return { insertCount: insertedIds.length, nextJobId: id };
  }else{
    console.log("finishing downloading messages");
    return { insertCount: insertedIds.length, nextJobId: undefined};
  }

};

export default downloadMessages;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      },
      include: {
        accounts: true,
      },
    });
    await downloadMessages({ account: user.accounts[0] });
  })();
}
