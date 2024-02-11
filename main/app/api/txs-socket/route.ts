import { Server, Socket } from 'socket.io'
import { txsDisplay } from '../worker-callback/route';
import { useSession } from 'next-auth/react';
import NextAuth, { Session } from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import config from "@/../config.json";
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, {
    providers: [ // FIXME: duplicate code
        GoogleProvider({
          clientId: config.GOOGLE_ID!,
          clientSecret: config.GOOGLE_SECRET!,
        }),
        // TODO: add more providers here
    ],
    callbacks: {
      session({ session, token, user, newSession, trigger }: {
        session: Session;
        token: JWT;
        user: AdapterUser;
      } & {
        newSession: any;
        trigger: "update";
      }) {
        const email = user?.email;
        if (email === undefined) {
          return session;
        }
      
        if ((res as any).socket.server.io) {
          console.log('Socket is already running');
        } else {
          console.log('Socket is initializing');
          const io = new Server((res as any).socket.server);
          (res as any).socket.server.io = io;
          io.on('connection', (socket: Socket) => {
            txsDisplay.addWebSocket(socket, email!); // FIXME: `!`
          });
        }
        (res as any).end();

        return session;
      }
    }
  })
}
