import { bufferToEthAddress, ethHashToBuffer, getTransactionHash } from "@/../util/eth";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { TransactionKind } from "@/../util/transactionKinds";
import { txsDisplay } from '@/../../util/workerClient';
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import Carbon from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import CarbonInfo from "@porton/carbon-flow/artifacts/Carbon.deployed.json";

export function POST(req: Request) {
    const session = useSession();
    const email = session!.data!.user!.email;

    async function doIt() {
        const j = await req.json();
        const {
            organizationId, comment,
        }: {
            organizationId: number, comment: string,
        } = j;
    
        const contract = new ethers.Contract(CarbonInfo["31337"].address, Carbon.abi); // FIXME: Specify the chain. // TODO: duplicate code
        const action = await contract.populateTransaction.createAuthority("uuid:TODO", "uuid:TODO");
        const serializedAction = ethers.utils.serializeTransaction(action);
        const colony = await colonyNetwork.getColony(await bufferToEthAddress(colonyAddress));
        const tx = await colony.makeArbitraryTransaction(
            CarbonInfo["31337"].address, // TODO
            serializedAction,
        ).motion().send();
        const txHash = ethers.utils.keccak256(await tx.encode());
        txsDisplay.onSubmitted(txHash, "create token");

        const prisma = new PrismaClient();
        // TODO: database transaction
        const dbTrans = await prisma.transaction.create({data: {
            tx: ethHashToBuffer(txHash),
            kind: TransactionKind.CREATE_TOKEN,
            confirmed: false,
        }});
        await prisma.createNewTokenTransaction.create({data: {
            id: dbTrans.id,
            organizationId,
            comment,
        }});
    }
    doIt().then(() => {});

    return NextResponse.json({});
}