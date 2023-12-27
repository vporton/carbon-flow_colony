import { colonyNetwork, ethProvider } from "@/../util/serverSideEthConnect";
import { ColonyEventManager, ColonyNetwork, ColonyRpcEndpoint, Network } from "@colony/sdk";
import { getColonyNetworkClient } from '@colony/colony-js'; // TODO: Remove `@colony/colony-js` dependency.
import { PrismaClient } from "@prisma/client";
import { IColonyEvents__factory as ColonyEventsFactory } from '@colony/events';
import { providers, utils } from "ethers";
import { TransactionKind } from "@/../util/transactionKinds";
import { ethAddressToBuffer, ethHashToBuffer } from "@/../util/eth";

import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.WORKER_PORT || 3001;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

async function worker() {
    const prisma = new PrismaClient();
    
    const eventManager = new ColonyEventManager(ethProvider);
    const colonyEventSource = eventManager.createEventSource(ColonyEventsFactory);

    async function processEvent(event: any, id: number, kind: TransactionKind, tx: string) {
        // TODO: Process remaining events on startup.
        // const txs = await prisma.transaction.findMany(
        //     {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirmed: false}}
        // );
        // TODO: Read `txs` outside of the loop.
        switch (kind) {
            case TransactionKind.CREATE_ORGANIZATION:
                const {organizationName, colonyNickName} = await prisma.createNewOrganizationTransaction.findFirstOrThrow({
                    select: {tokenName: true, tokenSymbol: true, colonyNickName: true, organizationName: true},
                    where: {id},
                });
                await prisma.organization.create({
                    data: {
                        name: organizationName,
                        colonyNickName,
                        colonyAddress: ethAddressToBuffer(event.data.colonyNetwork),
                        tokenAddress: ethAddressToBuffer(event.data.token),
                        tokenAuthorityAddress: ethAddressToBuffer("0x0"), // FIXME                  
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

    // TODO: Remove old events from the DB.

    const filter = await eventManager.createMultiFilter(colonyEventSource, [
        'ColonyInitialised(address,address,address)',
    ]);
    eventManager.provider.on('block', async (no: number) => {
        const events = await eventManager.getMultiEvents(
            [ filter ],
            { fromBlock: no, toBlock: no },
        );
        for (const event of events) {
            const dbRes = await prisma.transaction.findFirst({
                select: { id: true, kind: true, blockChecked: true }, // TODO: Are all `select` args necessary?
                where: { confirmed: false, tx: ethHashToBuffer(event.transactionHash) },
            });
            if (dbRes !== null) {
                const { id, kind } = dbRes;
                await processEvent(event, id, kind, event.transactionHash);
                // TODO: Should use the function `NOW` instead of `new Date()`.
                await prisma.transaction.update({where: {id}, data: {confirmed: true, blockChecked: no, lastCheckedAt: new Date()}});
            }
        }
    });
}

app.listen(port, () => {
    console.log(`[worker]: Worker is running at http://localhost:${port}`);
});

worker().then(() => {});