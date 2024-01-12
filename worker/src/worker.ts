import { colonyNetwork, ethProvider } from "@/../util/serverSideEthConnect";
import { ColonyEventManager, ColonyNetwork, ColonyRpcEndpoint, Network } from "@colony/sdk";
import { getColonyNetworkClient } from '@colony/colony-js'; // TODO: Remove `@colony/colony-js` dependency.
import { PrismaClient } from "@prisma/client";
import { IColonyEvents__factory as ColonyEventsFactory } from '@colony/events';
import { ethers, providers, utils } from "ethers";
import { TransactionKind } from "@/../util/transactionKinds";
import { bufferToEthHash, ethAddressToBuffer, ethHashToBuffer } from "@/../util/eth";

import express, { Express, Request, Response } from "express";

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

    eventManager.provider.on('block', async (no: number) => {
        await processEvents(prisma, no, 0);
    });
    processEvents(prisma, await ethProvider.getBlockNumber(), 50); // FIXME: Make configurable.
}

// FIXME: mutex (https://github.com/DirtyHairy/async-mutex)
async function processEvent(prisma: PrismaClient, log: ethers.providers.Log, id: number, kind: TransactionKind, tx: string) {
    switch (kind) {
        case TransactionKind.CREATE_ORGANIZATION:
            const abi = [
                "event ColonyInitialised(address agent, address colonyNetwork, address token)"
            ];
            const iface = new ethers.utils.Interface(abi); // TODO: Move it out of the loop.
            const event = iface.parseLog(log);

            const {organizationName, colonyNickName} = await prisma.createNewOrganizationTransaction.findFirstOrThrow({
                select: {tokenName: true, tokenSymbol: true, colonyNickName: true, organizationName: true},
                where: {id},
            });
            await prisma.organization.create({
                data: {
                    name: organizationName,
                    colonyNickName,
                    colonyAddress: ethAddressToBuffer(event.args.colonyNetwork),
                    tokenAddress: ethAddressToBuffer(event.args.token),
                },
            });
            break;
    }
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

async function processEvents(prisma: PrismaClient, blockNo: number, depth: number) {
    const txs = await prisma.transaction.findMany(
        {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirmed: false}}, // TODO: Select fewer fields.
    );
    for (const transaction of txs) {
        const txHash = await bufferToEthHash(transaction.tx);
        const receipt = await ethProvider.getTransactionReceipt(txHash);
        for (const event of receipt.logs) {
            processEvent(prisma, event, transaction.id, transaction.kind, txHash);
        }
    }
}

app.listen(port, () => {
    console.log(`[worker]: Worker is running at http://localhost:${port}`);
});

worker().then(() => {});