import { Server } from 'socket.io';
import { Hash } from 'viem';

// Notifies the client by WebSocket, when our Ethereum transaction is confirmed.
class TxNotifier {
    wsInfo = Symbol(); // the symbol that we add to each server
    m : { [tx: Hash]: Record<symbol, Server> } = {}; // `server[wasInfo]` links back to `symbol`.
    private addHash(ws: Server, tx: Hash) {
        const s = Symbol(); // the symbol identifying the server
        (ws as any)[this.wsInfo] = s;
        if (tx !in this.m) {
            this.m[tx] = {};
        }
        this.m[tx][s] = ws;
    }
    addSocket(ws: Server) {
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

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('input-change', msg => {
        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler
