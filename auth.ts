import NextAuth, { Session, User } from "next-auth";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prismaClient";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  debug: false,
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signIn",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `openid \
          https://www.googleapis.com/auth/userinfo.profile \
          https://www.googleapis.com/auth/userinfo.email \
          https://www.googleapis.com/auth/gmail.send \
          https://www.googleapis.com/auth/gmail.metadata`,
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    authorized: (params) => {
      return !!params.auth?.user;
    },
    jwt(params) {
      console.log("*** in jwt callback: ", params);
      const { token } = params;
      return token;
    },
  },
  events: {
    signIn: async (message) => {
      console.log("*** got signIn event: ", message);
      const { user, account, profile } = message;
      if (
        account?.refresh_token &&
        account?.provider &&
        account?.providerAccountId
      ) {
        console.log("updating account as we have refresh_token")
        await prisma.account.update({
          data: {
            refresh_token: account.refresh_token,
          },
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });
      }
    },
    createUser: async (message) => {
      console.log("*** in createUser event with: ", message);
    },
    updateUser: async (message) => {
      console.log("*** in updateUser event with: ", message);
    },
  },
});
