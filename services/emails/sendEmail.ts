import prisma from "@/prismaClient";
import getGmailObject from "@/services/helpers/getGmailObject";
import { gmail_v1 } from "googleapis";
import { Account, Introduction } from "@prisma/client";
import { IntroStates } from "@/lib/introStates";
import Schema$Message = gmail_v1.Schema$Message;

export type PostEmailActionData = {
  intro: Introduction;
  successState: IntroStates;
  failureState: IntroStates;
};

export type SendEmailInput = {
  account: Account;
  from: string;
  to: string;
  cc: string;
  subject: string;
  body: string;
  postEmailActionData?: PostEmailActionData;
};

export const systemEmail =
  process.env.NODE_ENV === "production"
    ? "rod@introhub.net"
    : "sandeep@introhub.net";

type SendEmail = (input: SendEmailInput) => Promise<Schema$Message | undefined>;
const sendEmail: SendEmail = async (input) => {
  const { account, from, to, cc, subject, body, postEmailActionData } = input;

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const htmlBody = body.replaceAll("\r\n", "<br>");
  const toFixed =
    process.env.NODE_ENV === "production" ? to : "mistersingh179@gmail.com";
  const ccFixed =
    process.env.NODE_ENV === "production" ? cc : "mistersingh179@gmail.com";
  const bccFixed = process.env.NODE_ENV === "production" ? "" : "";

  const messageParts = [
    `From: ${from}`,
    `To: ${toFixed}`,
    `Cc: ${ccFixed}`,
    `Bcc: ${bccFixed}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    htmlBody,
  ];

  const message = messageParts.join("\n");

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  console.log(
    "Entire email message in an RFC 2822 format and base64url encoded string: ",
  );
  console.log(encodedMessage);

  try {
    const gmail = await getGmailObject(account);
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log("message sent: ", res.data);
    await takePostEmailAction(!!res.data.id, res.data?.threadId, postEmailActionData);
    return res.data;
  } catch (err) {
    console.log("in send email error: ", err);
    await takePostEmailAction(false, null, postEmailActionData);
  }
};

const takePostEmailAction = async (
  success: boolean,
  threadId: string | null | undefined,
  postEmailActionData?: PostEmailActionData,
) => {
  if (postEmailActionData) {
    const { intro, successState, failureState } = postEmailActionData;
    const newState = success ? successState : failureState;
    await prisma.introduction.update({
      where: {
        id: intro.id,
      },
      data: {
        status: newState,
        // threadId: threadId ?? "",
      },
    });
  }
};

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
      include: {
        accounts: true,
      },
    });
    const account = user.accounts[0];
    const intro = await prisma.introduction.findFirstOrThrow();
    const body = intro.messageForContact;

    await sendEmail({
      account,
      body,
      from: "Sandeep Arneja <sandeep@brandweaver.ai>",
      to: "Mister Singh <mistersingh179@gmail.com>",
      cc: "Sandeep Arneja ONE <sandeep+1@brandweaver.ai>",
      subject: "good morning 🥳. Please meet – Sandeep",
    });
  })();
}

export default sendEmail;
