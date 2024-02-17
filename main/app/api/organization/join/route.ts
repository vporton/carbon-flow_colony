import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession();
    const userEmail = session!.user!.email as string;
    const j = await req.json()
    const organizationId = j.organizationId as number;

    const prisma = new PrismaClient();
    await prisma.organizationsUsers.create({
        data: {
            userEmail,
            organizationId,
        },
    });

    return NextResponse.json({});
}
