import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// For an UI showing Ethereum transactions.

class StoreTxsServer {
    private websockets: WebSocket[] = [];

    addWebSocket(ws: WebSocket) {
        this.websockets.push(ws); // TODO: also remove
    }

    onSubmitted(txHash: string, message: string) {
        for (const ws of this.websockets) {
            ws.send(JSON.stringify({tx: txHash, message, state: 'submitted'}));
        }
    }

    onMined(txHash: string) {
        for (const ws of this.websockets) {
            ws.send(JSON.stringify({tx: txHash, state: 'mined'}));
        }
    }
}

// FIXME: Make it per-connection
export const txsDisplay: StoreTxsServer = new StoreTxsServer();

export async function POST(req: Request, res: Response) {
    if (req.headers.get('Authorization') !== process.env.BACKEND_SECRET!) {
        return NextResponse.json({ error: "Allowed only by backend" }, { status: 403 });
    }
    // Forward to client using WebSocket.
    const j: {tx: string} = await req.json();
    txsDisplay.onMined(j.tx);
    return NextResponse.json({});
}