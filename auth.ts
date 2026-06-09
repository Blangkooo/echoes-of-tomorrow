import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      // Re-read from DB until onboarded=true so the token stays fresh after onboarding
      if (token.id && !token.onboarded) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { onboarded: true },
        });
        token.onboarded = dbUser?.onboarded ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as typeof session.user & { onboarded: boolean }).onboarded =
          (token.onboarded as boolean) ?? false;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await db.futureSelfProfile.create({
        data: {
          userId: user.id!,
          futureYear: new Date().getFullYear() + 10,
          coreValues: [],
          lifeGoals: [],
        },
      });
    },
  },
});
