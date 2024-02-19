import { ethAddressToBuffer, ethHashToBuffer } from '@/../util/eth';
import { PrismaClient } from '@prisma/client';
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
        const onClose = () => {
            for (const tx of hashes) {
                let count = 0;
                for (const serverSymbol of Object.getOwnPropertySymbols(this.m[tx])) {
                    const server = this.m[tx][serverSymbol]; // TODO: unused
                    delete this.m[tx][serverSymbol];
                    ++count;
                }
                if (count === 0) {
                    delete this.m[tx]; // Free unused memory.
                }
            }
        }
        ws.on('message', data => {
            let tx0: Hash | undefined;
            try {
                const j = JSON.parse(data);
                tx0 = j.hash;
            } catch (e) {
                onClose();
                // TODO: Report error.
                return;
            }

            const tx = tx0 as Hash;
            const tx2 = ethHashToBuffer(tx); // may throw
            this.addHash(ws, tx);
            hashes.push(tx);

            (async () => {
                // TODO: The following may send notification second time. Does it matter?
                const prisma = new PrismaClient();
                const alreadyHappened = !!await prisma.transaction.findFirst({
                    select: {id: true, },
                    where: {tx: tx2, confirmed: true},
                });
                if (alreadyHappened) {
                    this.deliver(tx);
                }
            })().then(() => {});
        });
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

export let txNotifier: TxNotifier;

// FIXME: https://stackoverflow.com/a/76278248/856090 may provide more correct code.
function SocketHandler(req: Request, res: Response) {
  if (txNotifier) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    txNotifier = new TxNotifier((res as any).socket.server);
  }
  (res as any).end();
}

export default SocketHandler;
