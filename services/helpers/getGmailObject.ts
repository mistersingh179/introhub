import { Account, Message, User } from "@prisma/client";
import { formatDistanceToNow, fromUnixTime, isBefore, isPast } from "date-fns";
import { gmail_v1, google } from "googleapis";
import prisma from "@/prismaClient";
import downloadMessages from "@/services/downloadMessages";
import Gmail = gmail_v1.Gmail;
import refreshAccessToken from "@/services/helpers/refreshAccessToken";

type GetGmailObject = (account: Account) => Promise<Gmail>;

const getGmailObject: GetGmailObject = async (account: Account) => {
  account = await prisma.account.findFirstOrThrow({
    where: {
      id: account.id,
    },
  });
  const expiresAt = fromUnixTime(account.expires_at!);

  if (isPast(expiresAt)) {
    console.log(expiresAt, Date.now(), isPast(expiresAt));
    console.error("token expired", formatDistanceToNow(expiresAt), " ago");
    account = await refreshAccessToken(account);
  } else {
    console.log(
      "token is good. will expire in",
      formatDistanceToNow(fromUnixTime(account.expires_at!)),
    );
  }

  const gmail = google.gmail({
    version: "v1",
    headers: {
      Authorization: `Bearer ${account.access_token}`,
    },
  });

  return gmail;
};

export default getGmailObject;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      },
      include: {
        accounts: {
          where: {
            provider: "google",
          },
        },
      },
    });
    try {
      const gmail = await getGmailObject(user.accounts[0]);
      console.log("got gmail object: ", gmail);
    } catch (err) {
      console.error(err);
    }
  })();
}
