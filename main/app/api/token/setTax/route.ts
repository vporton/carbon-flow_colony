import { bufferToEthAddress, ethHashToBuffer, getTransactionHash } from "@/../util/eth";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { TransactionKind } from "@/../util/transactionKinds";
import { txsDisplay } from '@/../../util/workerClient';
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import Carbon from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import { carbonTokenAddress } from "@/../util/data";

export function POST(req: Request) {
    async function doIt() {
        const j = await req.json();
        const {
            tokenId, tax,
        }: {
            tokenId: number, tax: number,
        } = j;
    
        const contract = new ethers.Contract(carbonTokenAddress, Carbon.abi);
        const action = await contract.populateTransaction.setTax(tokenId, tax);
        const serializedAction = ethers.utils.serializeTransaction(action);
        const colony = await colonyNetwork.getColony(await bufferToEthAddress(colonyAddress));
        const [tx, _mined] = await colony.makeArbitraryTransaction(
            carbonTokenAddress, // TODO
            serializedAction,
        ).metaMotion().send();
        // TODO: Token comment in the annotation.
        await colony.annotateTransaction(tx.hash, `Set token #${tokenId} tax to ${tax*100}%`).metaMotion().send();
        txsDisplay.onSubmitted(tx.hash, "Set tax");

        const prisma = new PrismaClient();
        // TODO: database transaction
        const dbTrans = await prisma.transaction.create({data: {
            tx: ethHashToBuffer(tx.hash),
            kind: TransactionKind.CREATE_TOKEN,
        }});
        await prisma.setTaxTransaction.create({data: {
            id: dbTrans.id,
            tokenId,
            tax,
        }});
    }
    doIt().then(() => {});

    return NextResponse.json({});
}