import prisma from "@/prismaClient";
import getGmailObject from "@/services/helpers/getGmailObject";
import { google } from "googleapis";

const refreshScopes = async (userId: string): Promise<string[]> => {
  let account = await prisma.account.findFirstOrThrow({
    where: {
      userId,
    },
  });

  const gmail = await getGmailObject(account);
  console.log(gmail.toString());

  account = await prisma.account.findFirstOrThrow({
    where: {
      userId,
    },
  });

  const at = account.access_token as string;
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: at,
  });
  const { scopes } = await oauth2Client.getTokenInfo(at);
  // console.log("tokenInfo: ", tokenInfo);

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      scope: scopes.join(" "),
    },
  });

  return scopes;
};

export default refreshScopes;

if (require.main === module) {
  (async () => {
    const scopes = await refreshScopes("clv2snocc001ffat35omiomam");
    console.log("scopes: ", scopes.join(" "));
    process.exit(0);
  })();
}
