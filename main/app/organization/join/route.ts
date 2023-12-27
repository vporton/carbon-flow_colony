import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    const j = await req.json()
    const session = await getServerSession();
    const userEmail = session!.user!.email as string;
    const orgId = j.organizationId;
    const prisma = new PrismaClient();
    await prisma.organizationsUsers.create({data: {userEmail: userEmail, organizationId: orgId}});
    return NextResponse.json({});
}
