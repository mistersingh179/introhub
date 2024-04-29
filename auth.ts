import NextAuth, { Session, User } from "next-auth";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prismaClient";

const makeOnboardCall = async (userId: string) => {
  console.log("going to make fetch call to onboard user: ", userId);
  const resp = await fetch(
    `${process.env.BASE_API_URL}/api/users/${userId}/onboard`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
      },
    },
  );
  console.log(await resp.json());
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  basePath: "/api/auth",
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
    async jwt(params) {
      console.log("*** in jwt callback: ", params);
      const { token, trigger, user } = params;
      if (trigger === "signUp") {
        console.log("user has just signed up: ", user);
        await makeOnboardCall(user.id!);
      }
      return token;
    },
  },
  events: {
    signIn: async (message) => {
      console.log("*** got signIn event: ", message);
      const { user, account, profile } = message;

      if (account?.provider && account?.providerAccountId) {
        console.log("*** updating user & account upon sign-in ***");

        const { userId } = await prisma.account.update({
          data: {
            scope: account?.scope,
            refresh_token: account?.refresh_token,
            access_token: account?.access_token,
          },
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        await prisma.user.update({
          data: {
            email: profile?.email,
            image: profile?.picture,
          },
          where: {
            id: userId,
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
