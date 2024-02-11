import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { txsDisplay } from '@/../../util/workerClient'

export async function POST(req: Request, res: Response) {
    if (req.headers.get('Authorization') !== process.env.BACKEND_SECRET!) {
        return NextResponse.json({ error: "Allowed only by backend" }, { status: 403 });
    }
    // Forward to client using Socket.
    const j: {tx: string} = await req.json();
    txsDisplay.onMined(j.tx);
    return NextResponse.json({});
}