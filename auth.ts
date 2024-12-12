import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prismaClient";
import Credentials from "@auth/core/providers/credentials";
import LinkedIn, { LinkedInProfile } from "@auth/core/providers/linkedin";
import { scopeWeAskForDuringGoogleAuth } from "@/app/utils/constants";

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
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
      client: { token_endpoint_auth_method: "client_secret_post" },
      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: { scope: "openid profile email" },
      },
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
      },
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      userinfo: {
        url: "https://api.linkedin.com/v2/userinfo",
      },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      profile(profile: LinkedInProfile) {
        console.log("*** in profile with: ", profile);
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
        };
      },
      checks: ["none"],
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: scopeWeAskForDuringGoogleAuth,
          access_type: "offline",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        userToImpersonate: {},
      },
      async authorize(credentials) {
        const { userToImpersonate } = credentials;
        const user = await prisma.user.findFirstOrThrow({
          where: {
            id: userToImpersonate as string,
          },
        });
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: (params) => {
      return !!params.auth?.user;
    },
    async jwt(params) {
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
