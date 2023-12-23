import { colonyNetwork, ethProvider } from "@/../util/serverSideEthConnect";
import { ColonyEventManager, ColonyNetwork, ColonyRpcEndpoint, Network } from "@colony/sdk";
import { getColonyNetworkClient } from '@colony/colony-js';
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
    
    // const provider = new providers.JsonRpcProvider(ColonyRpcEndpoint.Gnosis); // TODO: WebSocket?

    const eventManager = new ColonyEventManager(ethProvider);
    const colonyEventSource = eventManager.createEventSource(ColonyEventsFactory);

    async function processEvent(event: any, id: number, kind: TransactionKind) {
        switch (kind) {
            case TransactionKind.CREATE_ORGANIZATION:
                const {organizationName, colonyNickName} = await prisma.createNewOrganizationTransaction.findFirstOrThrow({
                    select: {tokenName: true, tokenSymbol: true, colonyNickName: true, organizationName: true},
                    where: {id},
                })
                await prisma.organization.create({
                    data: {
                        name: organizationName,
                        colonyNickName,
                        colonyAddress: ethAddressToBuffer(event.args.colonyAddress),
                        tokenAddress: ethAddressToBuffer(event.args.tokenAddress),
                        tokenAuthorityAddress: ethAddressToBuffer("0x0"), // FIXME                  
                    },
                });
                break;
        }
    }

    // TODO: Remove old events from the DB.

    // TODO: Process remaining events on startup.
    const txs = await prisma.transaction.findMany(
        {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirmed: false}}
    );

    const filter = await eventManager.createMultiFilter(colonyEventSource, [
        'ColonyInitialised(address,address)',
    ]);
    eventManager.provider.on('block', async (no: number) => {
        const events = await eventManager.getMultiEvents(
            [ filter ],
            { fromBlock: no, toBlock: no },
        );
        for (const event of events) {
            const { id, kind } = await prisma.transaction.findFirstOrThrow({ // FIXME
                select: {id: true, kind: true, blockChecked: true}, // TODO: Are all `select` args necessary?
                where: {confirmed: false, tx: ethHashToBuffer(event.transactionHash)},
            });
            await processEvent(event, id, kind);
            // TODO: Should use the function `NOW` instead of `new Date()`.
            await prisma.transaction.update({where: {id}, data: {confirmed: true, blockChecked: no, lastCheckedAt: new Date()}});
        }
    }
}

app.listen(port, () => {
    console.log(`[worker]: Worker is running at http://localhost:${port}`);
});

worker().then(() => {});