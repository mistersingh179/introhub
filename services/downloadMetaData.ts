import { Account, Message, User } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import prisma from "@/prismaClient";
import { gmail_v1 } from "googleapis";
import Schema$MessagePartHeader = gmail_v1.Schema$MessagePartHeader;
import {
  parseAddressList,
  ParsedMailbox,
  parseOneAddress,
} from "email-addresses";

export type DownloadMetaDataInput = {
  messageId: string;
  account: Account;
};

type DownloadMetaData = (input: DownloadMetaDataInput) => Promise<void>;

const downloadMetaData: DownloadMetaData = async (input) => {
  const { messageId } = input;
  const account = await prisma.account.findFirstOrThrow({
    where: {
      id: input.account.id,
    },
  });
  const gmail = await getGmailObject(account);
  const {
    data: { internalDate, payload },
    status,
    statusText,
  } = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "metadata",
  });
  console.log("messages get: ", status, statusText);
  // console.log("internalDate: ", internalDate);
  if (!payload?.headers) {
    console.log("no headers found on this message");
    return;
  }
  const { headers } = payload;
  // console.log(headers);
  const subject = getHeaderValue(headers, "Subject");
  const deliveredTo = getHeaderValue(headers, "Delivered-To");
  const gmailMessageId = getHeaderValue(headers, "Message-ID");
  const fromObj = parseEmail(getHeaderValue(headers, "From"));
  const replyToObj = parseEmail(getHeaderValue(headers, "Reply-To"));
  const toObj = parseEmail(getHeaderValue(headers, "To"));
  const receivedAt = internalDate ? new Date(Number(internalDate)) : undefined;

  console.log(subject, deliveredTo, fromObj, replyToObj, receivedAt);

  await prisma.message.update({
    data: {
      subject,
      deliveredTo,
      fromName: fromObj.name,
      fromAddress: fromObj.address,
      replyToName: replyToObj.name,
      replyToAddress: replyToObj.address,
      toName: toObj.name,
      toAddress: toObj.address,
      gmailMessageId: gmailMessageId,
      receivedAt: receivedAt,
    },
    where: {
      id: messageId,
    },
  });
};

export default downloadMetaData;

export const getHeaderValue = (
  headers: Schema$MessagePartHeader[],
  headerName: string,
) => {
  const item = headers.find((x) => x.name === headerName);
  return item?.value || "";
};

export const parseEmail = (headerValue: string) => {
  const address = "";
  const name = "";
  if (headerValue) {
    const addresses = parseAddressList(headerValue);
    if (addresses && addresses[0]) {
      return {
        address: (addresses[0] as ParsedMailbox).address,
        name: (addresses[0] as ParsedMailbox).name,
      };
    }
  }
  return {
    address,
    name,
  };
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
    await downloadMetaData({
      messageId: user.messages[0].id,
      account: user.accounts[0],
    });
  })();
}
