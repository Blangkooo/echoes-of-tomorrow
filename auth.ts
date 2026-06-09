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
    strategy: "database",
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Check onboarding status
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { onboarded: true },
        });
        (session.user as typeof session.user & { onboarded: boolean }).onboarded =
          dbUser?.onboarded ?? false;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Create default future self profile for new users
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
