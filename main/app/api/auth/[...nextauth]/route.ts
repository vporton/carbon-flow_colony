import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import config from "@/../../config.json";

const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: config.GOOGLE_ID!,
          clientSecret: config.GOOGLE_SECRET!,
        }),
        // TODO: add more providers here
    ],
});

export { handler as GET, handler as POST };