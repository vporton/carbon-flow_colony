import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // FIXME: Access denied when called not by the worker.
    // TODO: Forward to client using WebSocket.
    return NextResponse.json({});
}