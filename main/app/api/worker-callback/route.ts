import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Socket } from "socket.io";

// For an UI showing Ethereum transactions.

class StoreTxsServer {
    private websockets: Socket[] = [];

    addWebSocket(ws: Socket) {
        this.websockets.push(ws); // TODO: also remove
    }

    onSubmitted(txHash: string, message: string) {
        for (const ws of this.websockets) {
            ws.on('close', () => {
                this.websockets = Array.from(this.websockets.filter(e => e !== ws)); // TODO: inefficient
                // TODO: Remove `this` itself, when elements are drained.
            });
            ws.send(JSON.stringify({tx: txHash, message, state: 'submitted'}));
        }
    }

    onMined(txHash: string) {
        for (const ws of this.websockets) {
            ws.send(JSON.stringify({tx: txHash, state: 'mined'}));
        }
    }
}

export const txsDisplay: { [user: string]: StoreTxsServer } = {}; //new StoreTxsServer();

// TODO: Use. `onMined` or `onSubmitted`?
export async function POST(req: Request, res: Response) {
    if (req.headers.get('Authorization') !== process.env.BACKEND_SECRET!) {
        return NextResponse.json({ error: "Allowed only by backend" }, { status: 403 });
    }
    // Forward to client using Socket.
    const j: {tx: string, userId: number} = await req.json();
    txsDisplay[j.userId].onMined(j.tx);
    return NextResponse.json({});
}