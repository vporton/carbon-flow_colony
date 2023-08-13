import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const j = JSON.parse(await req.json());
    const userEmail = ''; // FIXME
    const orgId = j.organizationId;
    const prisma = new PrismaClient();
    await prisma.organizationsUsers.create({data: {userEmail: userEmail, organizationId: orgId}});
    return NextResponse.json({});
}
