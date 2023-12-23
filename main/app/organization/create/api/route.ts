import { ethHashToBuffer } from "@/../util/eth";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { TransactionKind } from "@/../util/transactionKinds";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

async function waitForCreateOrganizationConfirmed(tx: string) {
    
}

export async function POST(req: Request) {
    // TODO
    // const j = JSON.parse(await req.json());
    // const {
    //     tokenName, tokenSymbol, colonyNickName, organizationName,
    // }: {
    //     tokenName: string, tokenSymbol: string, colonyNickName: string, organizationName: string,
    // } = j;

    // const [tx, _promise] = await colonyNetwork
    //     .createColony({ name: tokenName, symbol: tokenSymbol }, colonyNickName) // TODO: More parameters
    //     .metaTx().send();

    // const prisma = new PrismaClient();
    // // TODO: database transaction
    // const dbTrans = await prisma.transaction.create({data: {
    //     tx: ethHashToBuffer(tx.hash),
    //     kind: TransactionKind.CREATE_ORGANIZATION,
    //     confirmed: false,
    // }});
    // await prisma.createNewOrganizationTransaction.create({data: {
    //     id: dbTrans.id,
    //     tokenName,
    //     tokenSymbol,
    //     colonyNickName,
    //     organizationName,
    // }});

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