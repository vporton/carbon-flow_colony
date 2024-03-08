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

    // These two processEvents() don't create duplicate data thanks to `prisma.$transaction`.
    eventManager.provider.on('block', async (no: number) => {
        await processEvents(prisma);
    });
    processEvents(prisma);
}

// TODO: mutex (https://github.com/DirtyHairy/async-mutex) not needed?
async function doProcessEvent(prisma: PrismaClient, log: ethers.providers.Log, id: number, kind: TransactionKind, tx: string) {
    switch (kind) {
        case TransactionKind.CREATE_ORGANIZATION: {
            const abi = ["event ColonyInitialised(address agent, address colonyNetwork, address token)"];
            const iface = new ethers.utils.Interface(abi); // TODO: Move it out of the loop.
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
                    colonyAddress: ethAddressToBuffer(event.args.colonyNetwork),
                    tokenAddress: ethAddressToBuffer(event.args.token),
                    tokenName,
                    tokenSymbol,
                },
            });
            break;
        }
        case TransactionKind.CREATE_TOKEN: {
            const abi = ["event NewToken(uint256 indexed id, address indexed owner, string uri)"];
            const iface = new ethers.utils.Interface(abi);
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
            break;
        }
        case TransactionKind.REMOVE_TOKEN: {
            const {organizationId, tokenId} = await prisma.removeTokenTransaction.findUniqueOrThrow({
                select: {organizationId: true, tokenId: true},
                where: {id},
            });
            await prisma.organizationsTokens.delete({
                where: {
                    organizationId,
                    tokenId,
                },
            });
            break;
        }
    }
}

async function processEvent(prisma: PrismaClient, log: ethers.providers.Log, id: number, kind: TransactionKind, tx: string) {
    await doProcessEvent(prisma, log, id, kind, tx);
    fetch(process.env.BACKEND_URL+"/api/worker-callback", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': process.env.BACKEND_SECRET!,
        },          
        body: JSON.stringify({tx, state: 'mined'}),
    }).then(() => {});
}

async function processEvents(prisma: PrismaClient) {
    prisma.$transaction(async _ => {
        const txs = await prisma.transaction.findMany(
            {select: {id: true, tx: true, kind: true}, where: {confirmed: false}}, // TODO: Select fewer fields.
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
        await prisma.transaction.updateMany({ data: {confirmed: true}, where: { id: { in: txs.map(tx => tx.id) } }});
    });
}

app.listen(port, () => {
    console.log(`[worker]: Worker is running at http://localhost:${port}`);
});

worker().then(() => {});