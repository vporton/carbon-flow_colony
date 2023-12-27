import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// For an UI showing Ethereum transactions.

class StoreTxsServer {
    private websockets: WebSocket[] = [];

    addWebSocket(ws: WebSocket) {
        this.websockets.push(ws); // TODO: also remove
    }

    onMined(txHash: string) {
        for (const ws of this.websockets) {
            ws.send(txHash);
        }
    }
}

export const txsDisplay: StoreTxsServer = new StoreTxsServer();

export async function POST(req: Request, res: Response) {
    // TODO: Forward to client using WebSocket.
    if (req.headers.get('Authorization') !== process.env.BACKEND_SECRET!) {
        return NextResponse.json({ error: "Allowed only by backend" }, { status: 403 });
    }
    const j: {tx: string} = await req.json();
    txsDisplay.onMined(j.tx);
    return NextResponse.json({});
}