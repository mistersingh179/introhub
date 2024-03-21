import { google } from "googleapis";
import prisma from "@/prismaClient";
import { fromUnixTime, isBefore } from "date-fns";

(async () => {
  console.log("hello world from playWithGmail");

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@brandweaver.ai",
    },
    include: {
      accounts: true,
    },
  });
  const accessToken = user.accounts[0].access_token!;
  const expiresAt = user.accounts[0].expires_at!;

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
  const { data: profileData } = await gmail.users.getProfile({
    userId: "me",
  });
  console.log("profile: ", profileData);

  const { data: messagesData } = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
    // q: 'to: sandeep@brandweaver.ai',
    includeSpamTrash: false,
  });
  console.log("messagesData: ", messagesData);
  const messagedId = messagesData.messages![0].id!;

  const { data: messageData } = await gmail.users.messages.get({
    userId: "me",
    id: messagedId,
    format: "metadata",
  });
  console.log("messageData: ", messageData);
  const { id, threadId, payload, internalDate } = messageData;
  console.log(id, threadId, new Date(internalDate!).toString());

  const headers = messageData.payload!.headers!;
  console.log("headers: ", headers);
  const hash = {};
  for (const header of headers) {
    if (header.name) {
      const name = header.name as string;
      const value = header.value as string;
      console.log(name);
    }
  }
})();

export {};
