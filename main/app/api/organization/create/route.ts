import { ethHashToBuffer, getTransactionHash } from "@/../util/eth";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { TransactionKind } from "@/../util/transactionKinds";
import { txsDisplay } from '@/../../util/workerClient';
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";

export function POST(req: Request) {
    const session = useSession();
    const email = session.data?.user?.email;
    if (email === undefined) {
        return;
    }

    async function doIt() {
        const j = await req.json();
        const {
            tokenName, tokenSymbol, colonyNickName, organizationName,
        }: {
            tokenName: string, tokenSymbol: string, colonyNickName: string, organizationName: string,
        } = j;
    
        const tx = await colonyNetwork.createColony({ name: tokenName, symbol: tokenSymbol }, colonyNickName); // TODO: More parameters
        const txHash = await getTransactionHash(await tx.tx().encode());
        txsDisplay.onSubmitted(txHash, "create colony");

        const prisma = new PrismaClient();
        // TODO: database transaction
        const dbTrans = await prisma.transaction.create({data: {
            tx: ethHashToBuffer(txHash),
            kind: TransactionKind.CREATE_ORGANIZATION,
        }});
        await prisma.createNewOrganizationTransaction.create({data: {
            id: dbTrans.id,
            tokenName,
            tokenSymbol,
            colonyNickName,
            organizationName,
        }});
        const [tx2, _promise] = await tx.metaMotion().send();
    }
    doIt().then(() => {});
    // console.assert(tx2.hash === txHash, "Programming error: hashes don't match: %s !== %s", txHash, tx2.hash); // This fails!

    return NextResponse.json({});
}