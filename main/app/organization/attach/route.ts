import { ethAddressToBuffer } from "@/../../util/eth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const j = JSON.parse(await req.json());
    const data: {
        name: string,
        colonyNickName: string,
        colonyAddress: Buffer,
        tokenAddress: Buffer,
        tokenAuthorityAddress: Buffer,
    } = {
        name: j.name,
        colonyNickName: j.colonyNickName,
        colonyAddress: ethAddressToBuffer(j.colonyAddress),
        tokenAddress: ethAddressToBuffer(j.tokenAddress),
        tokenAuthorityAddress: ethAddressToBuffer(j.tokenAuthorityAddress),
    };
    const session = await getServerSession();
    const userEmail = session!.user!.email as string;
    const prisma = new PrismaClient();
    let org = await prisma.organization.create({data});
    await prisma.organizationsUsers.create({data: {userEmail, organizationId: org.id}});
    return NextResponse.json({});
}
