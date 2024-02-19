import { Server, Socket } from 'socket.io'
import { txsDisplay } from '@/../../util/workerClient';
import { getServerSession } from 'next-auth';

async function handler(req: Request, res: Response) {
  const session = await getServerSession();
  const email = session!.user!.email;

  if ((res as any).socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server((res as any).socket.server);
    (res as any).socket.server.io = io;
    io.on('connection', (socket: Socket) => {
      txsDisplay.addWebSocket(socket, email!);
    });
  }
  (res as any).end();
}

export { handler as GET };