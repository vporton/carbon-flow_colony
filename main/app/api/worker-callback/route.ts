import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
    error?: string
};

export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
    // TODO: Forward to client using WebSocket.
    if (req.headers.get('Authorization') !== process.env.BACKEND_SECRET!) {
        // res.status(403).json({ error: "Allowed only by backend" });
        return Response.json({ error: "Allowed only by backend" }, { status: 403 });
    }
    return NextResponse.json({});
}