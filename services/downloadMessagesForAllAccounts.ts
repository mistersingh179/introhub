import prisma from "@/prismaClient";
import mediumQueue from "@/bull/queues/mediumQueue";

type DownloadMessagesForAllAccounts = () => Promise<void>;

const downloadMessagesForAllAccounts: DownloadMessagesForAllAccounts = async () => {
  const accounts = await prisma.account.findMany();
  for (const account of accounts) {
    const jobObj = await mediumQueue.add("downloadMessages", {
      account: account,
    });
    const { name, id } = jobObj;
    console.log("scheduled downloadMetaData job: ", name, id);
  }
};

export default downloadMessagesForAllAccounts