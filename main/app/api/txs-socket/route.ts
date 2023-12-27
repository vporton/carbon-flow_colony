import { Server } from 'socket.io'
import { txsDisplay } from '../worker-callback/route';

const SocketHandler = (req: Request, res: Response) => {
  if ((res as any).socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server((res as any).socket.server);
    (res as any).socket.server.io = io;
    txsDisplay.addWebSocket((res as any).socket); // FIXME: or `socket.server` or `io`?
  }
  (res as any).end()
}

export default SocketHandler;
