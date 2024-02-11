import { colonyNetwork, ethProvider } from "@/../util/serverSideEthConnect";
import { ColonyEventManager, ColonyNetwork, ColonyRpcEndpoint, Network } from "@colony/sdk";
import { getColonyNetworkClient } from '@colony/colony-js'; // TODO: Remove `@colony/colony-js` dependency.
import { PrismaClient } from "@prisma/client";
import { IColonyEvents__factory as ColonyEventsFactory } from '@colony/events';
import { ethers } from "ethers";
import { TransactionKind } from "@/../util/transactionKinds";
import { bufferToEthHash, ethAddressToBuffer, ethHashToBuffer } from "@/../util/eth";
import Semaphore from "@chriscdn/promise-semaphore";

import express, { Express, Request, Response } from "express";
import { Session } from "inspector";

const app: Express = express();
const port = process.env.WORKER_PORT || 3001;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

// TODO: global variables
const eventManager = new ColonyEventManager(ethProvider);
// const colonyEventSource = eventManager.createEventSource(ColonyEventsFactory);

async function worker() {
    const prisma = new PrismaClient();

    // TODO: Remove old events from the DB.

    // TODO: What should be the order of the following two statements?
    eventManager.provider.on('block', async (no: number) => {
        await processEvents(prisma);
    });
    processEvents(prisma); // FIXME: Make configurable.
}

// TODO: mutex (https://github.com/DirtyHairy/async-mutex) not needed?
async function doProcessEvent(prisma: PrismaClient, log: ethers.Log, id: number, kind: TransactionKind, tx: string) {
    switch (kind) {
        case TransactionKind.CREATE_ORGANIZATION: {
            const abi = ["event ColonyInitialised(address agent, address colonyNetwork, address token)"];
            const iface = new ethers.Interface(abi); // TODO: Move it out of the loop.
            const event = iface.parseLog(log as unknown as {topics: string[], data: string});

            const {organizationName, colonyNickName, tokenName, tokenSymbol} =
                await prisma.createNewOrganizationTransaction.findFirstOrThrow({
                    select: {tokenName: true, tokenSymbol: true, colonyNickName: true, organizationName: true},
                    where: {id},
                });
            await prisma.organization.create({
                data: {
                    name: organizationName,
                    colonyNickName,
                    colonyAddress: ethAddressToBuffer(event!.args.colonyNetwork), // FIXME: `!`
                    tokenAddress: ethAddressToBuffer(event!.args.token), // FIXME: `!`
                    tokenName,
                    tokenSymbol,
                },
            });
            break;
        }
        case TransactionKind.CREATE_TOKEN: {
            const abi = ["event NewToken(uint256 indexed id, address indexed owner, string uri)"];
            const iface = new ethers.Interface(abi);
            const event = iface.parseLog(log as unknown as {topics: string[], data: string});

            const {organizationId, comment} = await prisma.createNewTokenTransaction.findFirstOrThrow({
                select: {organizationId: true, comment: true},
                where: {id},
            });
            const { id: tokenId } = await prisma.token.create({data: {}});
            await prisma.organizationsTokens.create({
                data: {
                    organizationId,
                    tokenId,
                    comment,
                },
            });
        }
    }
}

async function processEvent(prisma: PrismaClient, log: ethers.Log, id: number, kind: TransactionKind, tx: string) {
    await doProcessEvent(prisma, log, id, kind, tx);
    fetch(process.env.BACKEND_URL+"/api/worker-callback", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': process.env.BACKEND_SECRET!,
        },          
        body: JSON.stringify({tx, state: 'mined', userId: FIXME}),
    }).then(() => {});
}

async function processEvents(prisma: PrismaClient) {
    const txs = await prisma.transaction.findMany(
        {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirmed: false}}, // TODO: Select fewer fields.
    );
    const semaphore = new Semaphore(10);
    for (const transaction of txs) {
        try {
            await semaphore.acquire();
            bufferToEthHash(transaction.tx).then(async txHash => {
                const receipt = await ethProvider.getTransactionReceipt(txHash); // TODO: Process in parallel.
                if (receipt) { // TODO: Should it be `receipt !== null` or `receipt !== undefined`? TypeScript types are contradictory!
                    for (const event of receipt.logs) {
                        processEvent(prisma, event, transaction.id, transaction.kind, txHash);
                    }
                }
            });
        }
        finally {
            semaphore.release();
        }
    }
}

app.listen(port, () => {
    console.log(`[worker]: Worker is running at http://localhost:${port}`);
});

worker().then(() => {});