import { PrismaClient } from "@prisma/client";
import { colonyNetwork } from "../../../../../util/serverSideEthConnect";
import { RootDomain } from "@colony/sdk";
import { bufferToEthAddress, ethHashToBuffer } from "../../../../../util/eth";
import { TransactionKind } from "../../../../../util/transactionKinds";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    async function doIt() {
        const { organizationId, tokenId } = await req.json();

        const prisma = new PrismaClient();
        const { colonyAddress } = await prisma.organization.findUniqueOrThrow({ select: {colonyAddress: true}, where: {id: props.colonyId} });
        const colony = await colonyNetwork.getColony(await bufferToEthAddress(colonyAddress));
        const [, tx] = await colony.ext.motions!.createDecision().metaTx().send(); // FIXME: Install the extension
        const txHash = (await tx())[1].transactionHash;
        await colony.ext.motions!.annotateDecision(
            txHash,
            {
                motionDomainId: RootDomain,
                title: `Remove the token ${tokenId}`,
                description: `Remove the token ${tokenId} "${tokenComment}"`,
            },
        ).metaTx();
        // TODO: database transaction
        const dbTrans = await prisma.transaction.create({data: {
            tx: ethHashToBuffer(txHash),
            kind: TransactionKind.REMOVE_TOKEN,
        }});
        await prisma.removeTokenTransaction.create({data: {
            id: dbTrans.id,
            organizationId,
            tokenId,
        }});
    }
    
    doIt().then(() => {});

    return NextResponse.json({});
}