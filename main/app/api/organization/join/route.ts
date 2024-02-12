import { ethHashToBuffer, getTransactionHash } from "@/../util/eth";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { TransactionKind } from "@/../util/transactionKinds";
import { EthTxsContext } from "@/app/_sublayout2";
import { txsDisplay } from '@/../../util/workerClient';
import EthExecuting from "@/components/EthExecuting";
import { PrismaClient } from "@prisma/client";
import { assert } from "console";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (email === undefined) {
        return;
    }

    const j = await req.json();
    const organizationId = j.organizationId;

    const prisma = new PrismaClient();
    prisma.organizationsUsers.create({ data: {organizationId, userEmail: email!} });

    return NextResponse.json({});
}