import { Server, Socket } from 'socket.io';
import { Hash } from 'viem';

// Notifies the client by WebSocket, when our Ethereum transaction is confirmed.
// MISFEATURE: This has two responsibilities: connect WebSocket and process tx notifications.
class TxNotifier {
    wsInfo = Symbol(); // the symbol that we add to each server
    m : { [tx: Hash]: Record<symbol, Socket> } = {}; // `server[wasInfo]` links back to `symbol`.
    constructor(server: any) { // TODO: type
        const io = new Server(server);
        io.on('connection', ws => {
            if (ws.handshake.url == "/tx/wait") {
                this.addSocket(ws);
            }
        });
    }
    private addHash(ws: Socket, tx: Hash) {
        const s = Symbol(); // the symbol identifying the server
        (ws as any)[this.wsInfo] = s;
        if (tx !in this.m) {
            this.m[tx] = {};
        }
        this.m[tx][s] = ws;
    }
    addSocket(ws: Socket) {
        const hashes: Hash[] = [];
        ws.on('message', data => {
            // FIXME: Process errors.
            const j = JSON.parse(data);
            const hash = j.hash;
            this.addHash(ws, hash);
            hashes.push(hash);
        });
        const onClose = () => {
            for (const tx of hashes) {
                let count = 0;
                for (const serverSymbol of Object.getOwnPropertySymbols(this.m[tx])) {
                    const server = this.m[tx][serverSymbol];
                    delete this.m[tx][serverSymbol];
                    ++count;
                }
                if (count === 0) {
                    delete this.m[tx]; // Free unused memory.
                }
            }
        }
        ws.on('close', onClose.bind(this));
        ws.on('error', onClose.bind(this));
    }
    deliver(tx: Hash) {
        if (tx !in this.m) {
            return;
        }
        for (const serverSymbol of Object.getOwnPropertySymbols(this.m[tx])) {
            const server = this.m[tx][serverSymbol];
            server.send({});
        }
    }
}

const SocketHandler = (req: Request, res: Response) => {
  if ((res as any).socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new TxNotifier((res as any).socket.server);
    (res as any).socket.server.io = io;
  }
//   res.end() // TODO: needed?
}

export default SocketHandler
