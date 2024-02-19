import { bufferToEthAddress, ethHashToBuffer, getTransactionHash } from "@/../util/eth";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { TransactionKind } from "@/../util/transactionKinds";
import { EthTxsContext } from "@/app/_sublayout2";
import { txsDisplay } from '@/../../util/workerClient';
import EthExecuting from "@/components/EthExecuting";
import { PrismaClient } from "@prisma/client";
import { assert } from "console";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import Carbon from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import { carbonTokenAddress } from "@/../util/data";
import { ethers } from "ethers";

// TODO: This can be done in frontend.
export function POST(req: Request) {
    async function doIt() {
        const j = await req.json();
        const {
            token, amount, to, organizationId, // colonyAddress,
        }: {
            token: number, amount: bigint, to: string, organizationId: number, // colonyAddress: string,
        } = j;

        const prisma = new PrismaClient();
        const { colonyAddress } = await prisma.organization.findFirstOrThrow(
            { select: { colonyAddress: true }, where: {id: organizationId} });

        // TODO: Show tx popups also for transactions like this, that don't store in the DB.
        const contract = new ethers.Contract(carbonTokenAddress, Carbon.abi); // FIXME: Specify the chain.
        const action = await contract.populateTransaction.mint(to, token, amount, "");
        const serializedAction = ethers.utils.serializeTransaction(action);
        const colony = await colonyNetwork.getColony(await bufferToEthAddress(colonyAddress));
        // TODO: Should display transaction popup?
        await colony.makeArbitraryTransaction(
            carbonTokenAddress, // TODO
            serializedAction,
        ).motion().send();
    }
    doIt();
    return NextResponse.json({});
}