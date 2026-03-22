// lib/auth.ts
// Auth.js v5 (next-auth@beta) configuration — Magic Link only via Resend

import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";
import { Plan } from "@prisma/client";

const TRIAL_DURATION_DAYS = 14;

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
  },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "noreply@yourdomain.com",
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.plan = user.plan;
        session.user.trialEndsAt = user.trialEndsAt ?? null;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Runs when Auth.js creates a brand-new user row — activate 14-day trial
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS);

      await db.user.update({
        where: { id: user.id as string },
        data: {
          plan: Plan.TRIAL,
          trialEndsAt,
        },
      });
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
