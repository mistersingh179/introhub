import { Account, Message, User } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import prisma from "@/prismaClient";
import { gmail_v1 } from "googleapis";
import Schema$MessagePartHeader = gmail_v1.Schema$MessagePartHeader;
import downloadMessages from "@/services/downloadMessages";
import {ParsedMailbox, parseOneAddress} from "email-addresses";

type DownloadMetaData = (message: Message, account: Account) => Promise<void>;

const downloadMetaData: DownloadMetaData = async (
  message: Message,
  account: Account,
) => {
  const gmail = await getGmailObject(account);
  const {
    data: { internalDate, payload },
  } = await gmail.users.messages.get({
    userId: "me",
    id: message.id,
    format: "metadata",
  });
  console.log(internalDate);
  if (!payload?.headers) {
    console.log("no headers found on this message");
    return;
  }
  const { headers } = payload;
  console.log(headers);
  const subject = getHeaderValue(headers, "Subject");
  const deliveredTo = getHeaderValue(headers, "Delivered-To");
  const fromValue = getHeaderValue(headers, "From");
  const fromAddress = (parseOneAddress(fromValue) as ParsedMailbox | null)?.address || "";
  console.log(subject, deliveredTo, fromValue, fromAddress);

  await prisma.message.update({
    data: {
      subject,
      deliveredTo,
      from: fromAddress,
    },
    where: {
      id: message.id,
    },
  });
};

export default downloadMetaData;

const getHeaderValue = (
  headers: Schema$MessagePartHeader[],
  headerName: string,
) => {
  const item = headers.find((x) => x.name === headerName);
  return item?.value || "";
};

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      },
      include: {
        messages: true,
        accounts: {
          where: {
            provider: "google",
          },
        },
      },
    });
    await downloadMetaData(user.messages[0], user.accounts[0]);
  })();
}
