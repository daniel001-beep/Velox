import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.email = user.email;
      }
      // Grant admin rights if the email matches the environment variable
      if (token.email && process.env.ADMIN_EMAIL && token.email === process.env.ADMIN_EMAIL) {
        token.isAdmin = true;
      }
      return token;
    },
    session: ({ session, token }: any) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  providers: [], // Empty for now, will be populated in auth.ts
  trustHost: true,
} satisfies NextAuthConfig;
