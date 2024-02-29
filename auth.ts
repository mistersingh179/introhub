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
        },
        prompt: 'login'
      },
    }),
  ],
  callbacks: {
    authorized: (params) => {
      return !!params.auth?.user;
    },
    jwt(params) {
      const { token } = params;
      console.log("*** in jwt callback: ", params);
      return token;
    },
  },
  events: {
    signIn: async (message) => {
      console.log("*** got signIn event: ", message);
    },
    createUser: async (message) => {
      console.log("*** in createUser event with: ", message);
    },
    updateUser: async (message) => {
      console.log("*** in updateUser event with: ", message);
    },
  },
});
