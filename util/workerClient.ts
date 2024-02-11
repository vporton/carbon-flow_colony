import { Socket } from "socket.io";

// For an UI showing Ethereum transactions.

class StoreTxsServer {
    // Can this be simplified?
    private sockets: { [user: string]: { [_: symbol]: Socket } } = {};
    private userTxs: { [user: string]: string[] } = {}; // user -> txs
    private txs: { [tx: string]: string } = {}; // tx -> user

    addWebSocket(ws: Socket, user: string) {
        if (user !in this.sockets) {
            this.sockets[user] = {};
        }
        const s = Symbol();
        this.sockets[user][s] = ws;
        if (!(user in this.userTxs)) {
            this.userTxs[user] = [];
        }
        ws.on('close', () => {
            delete this.sockets[user][s];
            if (Object.keys(this.sockets[user]).length === 0) {
                for (const tx of this.userTxs[user]) {
                    delete this.txs[tx];
                }
                delete this.userTxs[user];
            }
        });
    }

    onSubmitted(txHash: string, message: string) {
        const websockets = this.sockets[this.txs[txHash]];
        for (const ws of Object.values(websockets) as Socket[]) {
            delete this.txs[txHash];
            ws.send(JSON.stringify({tx: txHash, message, state: 'submitted'}));
        }
    }

    onMined(txHash: string) {
        const websockets = this.sockets[this.txs[txHash]];
        for (const ws of Object.values(websockets) as Socket[]) {
            ws.send(JSON.stringify({tx: txHash, state: 'mined'}));
        }
    }
}

export const txsDisplay: StoreTxsServer = new StoreTxsServer();
