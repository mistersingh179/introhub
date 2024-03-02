import prisma from "@/prismaClient";
import { Account, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import MessageCreateManyInput = Prisma.MessageCreateManyInput;

type DownloadMessages = (account: Account) => Promise<void>;

const downloadMessages: DownloadMessages = async (account: Account) => {
  const gmail = await getGmailObject(account);

  const { data: messagesData } = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
    // q: 'to: sandeep@brandweaver.ai',
    includeSpamTrash: false,
  });

  const messagesPayload: MessageCreateManyInput[] = [];
  for (const item of messagesData.messages || []) {
    messagesPayload.push({
      userId: account.userId,
      id: item.id as string,
      threadId: item.threadId!,
    });
  }

  const result = await prisma.message.createMany({
    data: messagesPayload,
    skipDuplicates: true,
  });

  console.log("messages insert result: ", result.count);
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
    await downloadMessages(user.accounts[0]);
  })();
}
