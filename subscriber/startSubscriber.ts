import prisma from "@/prismaClient";
import getGmailObject from "@/services/helpers/getGmailObject";
import { Account } from "@prisma/client";
import { Message, PubSub } from "@google-cloud/pubsub";
import { gmail_v1 } from "googleapis";
import { getHeaderValue, parseEmail } from "@/services/downloadMetaData";
import { IntroStates } from "@/lib/introStates";
import moveIntroToBeApproved from "@/services/moveIntroToBeApproved";
import moveIntroToBeRejected from "@/services/moveIntroToBeRejected";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import permissionEmailReplyAnalysis, {
  permissionGrantedEnum,
} from "@/services/llm/permissionEmailReplyAnalysis";
import Schema$Message = gmail_v1.Schema$Message;

const extractBody = (message: Schema$Message): string => {
  const body = message.payload?.body;
  const snippet = message.snippet;
  const parts = message.payload?.parts;

  if (parts) {
    const textPart = parts.find((part) => part.mimeType === "text/plain");
    if (textPart?.body?.data) {
      return Buffer.from(textPart.body.data, "base64").toString("utf-8");
    }
    const htmlPart = parts.find((part) => part.mimeType === "text/html");
    if (htmlPart?.body?.data) {
      return Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
    }
  } else if (body?.data) {
    return Buffer.from(body.data, "base64").toString("utf-8");
  } else if (snippet) {
    return snippet;
  }

  return "";
};

export const messageHandler = async (message: Message) => {
  console.log("In messageHandler with: ", message);
  try {
    const data = JSON.parse(message.data.toString());
    const { emailAddress, historyId } = data as {
      emailAddress: string;
      historyId: number;
    };

    console.log("in message Handler with", emailAddress, historyId);

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: emailAddress,
      },
      include: {
        accounts: true,
        introductionsFacilitated: {
          where: {
            permissionEmailThreadId: {
              not: null,
            },
          },
          include: {
            requester: true,
            facilitator: true,
            contact: true,
          },
        },
      },
    });
    const intros: IntroWithContactFacilitatorAndRequester[] =
      user.introductionsFacilitated;

    const account = (user.accounts as Account[])[0];

    console.log("facilitated intros which need to be checked: ", intros.length);

    for (const intro of intros) {
      console.log("we have intro: ", intro.id, intro.permissionEmailThreadId);
      const threadId = intro.permissionEmailThreadId!;
      const gmail = await getGmailObject(account);
      const thread = await gmail.users.threads.get({
        userId: "me",
        id: threadId,
      });
      const messages = thread.data.messages ?? [];
      for (const message of messages) {
        console.log("processing message: ", message.id, message.threadId);
        if (message.id === threadId) {
          console.log("skipping this as its original outgoing message");
          continue;
        }
        const headers = message.payload?.headers ?? [];
        const fromObj = parseEmail(getHeaderValue(headers, "From"));
        const fromEmail = fromObj.address;
        const extractedBody = extractBody(message);
        const subject = getHeaderValue(headers, "subject");
        if (intro.contact.email === fromEmail) {
          console.log("this message came from contact");
          if (intro.status === IntroStates["permission email sent"]) {
            const { permissionGranted } =
              await permissionEmailReplyAnalysis(extractedBody);
            if (permissionGranted === permissionGrantedEnum.enum.yes) {
              await moveIntroToBeApproved(intro);
            } else if (permissionGranted === permissionGrantedEnum.enum.no) {
              await moveIntroToBeRejected(intro);
            } else {
              console.log("not updating intro, llmResult: ", permissionGranted);
            }
          } else {
            console.log("ignoring response as intro has state: ", intro.status);
          }
        }
        const permissionResponseEmail =
          await prisma.permissionResponseEmail.create({
            data: {
              introductionId: intro.id,
              fromEmail: fromEmail,
              bodyText: extractedBody,
              subject: subject,
            },
          });
        console.log("savedPermissionEmail: ", permissionResponseEmail);

        await gmail.users.messages.delete({
          userId: "me",
          id: message.id!,
        });
        console.log("deleted permission response email");
      }
    }
    console.log("going to 'Ack' (acknowledge) message, so we don't pull again");
    message.ack();
  } catch (err) {
    console.log("unable to handle message: ", err, message);
  }
};

const startSubscriber = async () => {
  console.log("in startSubscriber");
  const pubSubClient = new PubSub();
  const subscriptionName = process.env.SUBSCRIPTION_NAME!;
  const subscription = pubSubClient.subscription(subscriptionName);
  subscription.on("message", messageHandler);
};

(async () => {
  console.log("in startSubscriber");
  await startSubscriber();
})();
