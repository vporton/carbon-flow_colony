import { ethHashToBuffer, getTransactionHash } from "@/../util/eth";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { TransactionKind } from "@/../util/transactionKinds";
import { EthTxsContext } from "@/app/_sublayout2";
import { txsDisplay } from "@/app/api/worker-callback/route";
import EthExecuting from "@/components/EthExecuting";
import { PrismaClient } from "@prisma/client";
import { assert } from "console";
import { NextResponse } from "next/server";
import { useContext } from "react";

export async function POST(req: Request) {
    const j = JSON.parse(await req.json());
    const {
        tokenName, tokenSymbol, colonyNickName, organizationName,
    }: {
        tokenName: string, tokenSymbol: string, colonyNickName: string, organizationName: string,
    } = j;

    // FIXME: Store transaction to `CreateNewOrganizationTransaction` before sending it, to ensure no race conditions.
    const tx = await colonyNetwork.createColony({ name: tokenName, symbol: tokenSymbol }, colonyNickName); // TODO: More parameters
    const txHash = await getTransactionHash(await tx.tx().encode());
    txsDisplay.onSubmitted(txHash, "create colony");

    const prisma = new PrismaClient();
    // TODO: database transaction
    const dbTrans = await prisma.transaction.create({data: {
        tx: ethHashToBuffer(txHash),
        kind: TransactionKind.CREATE_ORGANIZATION,
        confirmed: false,
    }});
    await prisma.createNewOrganizationTransaction.create({data: {
        id: dbTrans.id,
        tokenName,
        tokenSymbol,
        colonyNickName,
        organizationName,
    }});
    const [tx2, _promise] = await tx.metaTx().send();
    console.assert(tx2.hash === txHash, "Programming error: hashes don't match");

    // // TODO: (should be `await` before `waitForCreateOrganizationConfirmed`?)
    // waitForCreateOrganizationConfirmed(tx.hash);
    // // const [{
    // //     tokenAddress,
    // //     colonyId,
    // //     colonyAddress,
    // //     token,
    // //     tokenAuthorityAddress,
    // //     metadata,
    // // }, parsedLogTransactionReceipt] = await promise();

    return NextResponse.json({});
}