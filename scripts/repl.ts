import prisma from "../prismaClient";
import { Contact } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import { google } from "googleapis";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log("***");
  // console.log(query, params);
  // console.log("***");
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("Hello world !!!");

  const email = "mistersingh179@gmail.com";

  let account = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        email,
      },
    },
  });
  console.log(account);

  const gmail = await getGmailObject(account);
  const { data: profileData } = await gmail.users.getProfile({
    userId: "me",
  });
  console.log("profile: ", profileData);

  account = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        email,
      },
    },
  });

  const at = account.access_token as string;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: at,
  });
  const tokenInfo = await oauth2Client.getTokenInfo(at);
  console.log("tokenInfo: ", tokenInfo);
})();

export {};
