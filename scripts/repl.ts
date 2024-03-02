import prisma from "../prismaClient";
import {ParsedMailbox, parseFrom, parseOneAddress} from "email-addresses";
import downloadMessages from "@/services/downloadMessages";
import getGmailObject from "@/services/helpers/getGmailObject";
import { gmail_v1, google } from "googleapis";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query);
  // console.log({ timestamp, params, duration, target });
});

const MY_GOOGLE_API_KEY = "AIzaSyCCiO10EMimJzYb5qSbrxtbiCxAwo-131U";

(async () => {

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@brandweaver.ai",
    },
    include: {
      accounts: {
        where: {
          provider: 'google'
        },
      }
    }
  });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  oauth2Client.setCredentials({
    refresh_token: user.accounts[0].refresh_token
  })

  try{
    const newAccessToken = await oauth2Client.getAccessToken();
    console.log("new access token is: ", newAccessToken);
  }catch(err){
    console.error('Error refreshing access token:', err);
    throw new Error('Could not refresh the access token.');
  }

  return



  const gmail = await getGmailObject(user.accounts[0]);
  const profile = await gmail.users.getProfile({
    userId: 'me'
  });
  console.log(profile);

})();

export {};
