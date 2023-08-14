import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSession } from 'next-auth/react';

export async function POST(req: Request) {
    const j = JSON.parse(await req.json());
    const session = await getSession();
    const userEmail = session!.user!.email as string;
    const orgId = j.organizationId;
    const prisma = new PrismaClient();
    await prisma.organizationsUsers.create({data: {userEmail: userEmail, organizationId: orgId}});
    return NextResponse.json({});
}
