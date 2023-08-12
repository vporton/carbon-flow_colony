import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_ID!,
          clientSecret: process.env.GOOGLE_SECRET!,
        }),
        // TODO: add more providers here
    ],
});

export { handler as GET, handler as POST };