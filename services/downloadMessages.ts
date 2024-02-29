import prisma from "@/prismaClient";
import { User } from "@prisma/client";
import {fromUnixTime, isBefore} from "date-fns";
import {google} from "googleapis";

type DownloadMessages = (user: User) => Promise<void>;

const downloadMessages: DownloadMessages = async (user: User) => {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      userId: user.id,
      provider: 'google',
    }
  });

  const accessToken = account.access_token!;
  const expiresAt = account.expires_at!;

  const now = new Date();
  const expAt = fromUnixTime(expiresAt);
  if (isBefore(expAt, now)) {
    console.error("token expired on: " + expAt + " and right now is: " + now);
    console.error("Aborting!");
    return;
  } else {
    console.error(
      "token will expire at: " + expAt + " and right now is: " + now,
    );
  }

  const gmail = google.gmail({
    version: "v1",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { data: messagesData } = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
    // q: 'to: sandeep@brandweaver.ai',
    includeSpamTrash: false,
  });

  console.log("messagesData: ");
  console.log(messagesData);
};

export default downloadMessages;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      }
    });
    await downloadMessages(user);
  })();
}