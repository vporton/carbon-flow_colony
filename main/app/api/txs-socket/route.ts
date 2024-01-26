import { Server } from 'socket.io'
import { txsDisplay } from '../worker-callback/route';
import { useSession } from 'next-auth/react';

const SocketHandler = (req: Request, res: Response) => {
  const session = useSession();
  const email = session.data?.user?.email;
  if (email === undefined) {
      return;
  }

  if ((res as any).socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server((res as any).socket.server);
    (res as any).socket.server.io = io;
    io.on('connection', (socket: any) => { // FIXME: It typecheck errors if I write `socket: WebSocket`.
      txsDisplay[email!].addWebSocket(socket);
    });
  }
  (res as any).end()
}

export default SocketHandler;
