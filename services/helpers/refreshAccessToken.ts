import { Account } from "@prisma/client";
import { google } from "googleapis";
import prisma from "@/prismaClient";
import { GetAccessTokenResponse } from "google-auth-library/build/src/auth/oauth2client";

const updateTokenIssueOnUser = async (userId: string, tokenIssue: boolean) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tokenIssue: tokenIssue,
    },
  });
};

const refreshAccessToken = async (account: Account): Promise<Account> => {
  console.log("refreshing access token: ");
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({
    refresh_token: account.refresh_token,
  });

  let result: GetAccessTokenResponse | null = null;

  try {
    result = await oauth2Client.getAccessToken();
  } catch (err) {
    await updateTokenIssueOnUser(account.userId, true);
    throw new NoRefreshTokenError((err as Error).message, {});
  }

  if (!result) {
    console.log("got no result from api call");
    await updateTokenIssueOnUser(account.userId, true);
    throw new NoRefreshTokenError("no result object", {});
  }

  const at = result.res?.data.access_token;
  const exp_at = result.res?.data.expiry_date;

  if (!at || !exp_at) {
    await updateTokenIssueOnUser(account.userId, true);
    throw new NoRefreshTokenError("unable to get refresh token", result);
  }

  await updateTokenIssueOnUser(account.userId, false);

  const updatedAccount = await prisma.account.update({
    data: {
      access_token: at,
      expires_at: Math.floor(exp_at / 1000),
    },
    where: {
      id: account.id,
    },
  });

  return updatedAccount;
};

export default refreshAccessToken;

class NoRefreshTokenError extends Error {
  info: { [key: string]: any };
  constructor(message: string, info: { [key: string]: any }) {
    super(message);
    this.info = info;
  }
}

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "rod@brandweaver-hq.com",
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
      await refreshAccessToken(user.accounts[0]);
    } catch (err) {
      console.error(err);
    }
  })();
}
