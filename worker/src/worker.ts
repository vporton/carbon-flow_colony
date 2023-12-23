import { colonyNetwork, ethProvider } from "@/../util/serverSideEthConnect";
import { ColonyEventManager } from "@colony/sdk";
import { PrismaClient } from "@prisma/client";
import { IColonyEvents__factory as ColonyEventsFactory } from '@colony/events';
import { utils } from "ethers";
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
    
    const manager = new ColonyEventManager(ethProvider);
    // TODO: Remove the below commented out code.
    // const colonyAddedEventSource = eventManager.createEventSource(ColonyAdded);
    // const colonyAddedFilter = eventManager.createFilter(colonyAddedEventSource, "ColonyAdded");
    // Here is an example: https://github.com/JoinColony/colonyJS/blob/main/packages/sdk/examples/browser/src/events.ts
    // See lines 35 and 36 in the above example
    // const colonyEventSource = manager.createEventSource(ColonyEventsFactory);

    // const ourEvents = manager.createMultiFilter(
    //     colonyEventSource,
    //     ['ColonyAdded(uint256,address,address)'], // FIXME
    //     // colonyAddress,
    // );

    // Ethers provider
    const provider = colonyNetwork.getInternalNetworkContract().provider; // That should work, but it is not elegant.

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

    // TODO: Remove old events.

    // TODO: Process remaining events on startup.
    const txs = await prisma.transaction.findMany(
        {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirmed: false}}
    );
    
    const filter = {
        // address: THE_ADDRESS_OF_YOUR_CONTRACT, // FIXME: without speicifying this, can read from fake contracts
        // topics: [
        //     utils.id('ColonyAdded(uint256,address,address)'),
        //     utils.id('Transfer(address,address,uint256)'),
        // ],
    };
    provider.on(filter, async (log) => { // FIXME: Is `async` supported here?
        console.log("_log, event", log)
        const transactionHash = log.transactionHash; // TODO: correct?
        const tx = await provider.getTransaction(transactionHash);
        const txData = tx.data;
        const to = tx.to;
        const { id, kind } = await prisma.transaction.findFirstOrThrow(
            // TODO: Are all `select` args necessary?
            {select: {id: true, kind: true, blockChecked: true}, where: {confirmed: false, tx: ethHashToBuffer(transactionHash)}} // FIXME
        );
        await processEvent(log, id, kind);
        // TODO: Is `event.block` a correct field?
        // TODO: Should use the function `NOW` instead of `new Date()`.
        await prisma.transaction.update({where: {id}, data: {confirmed: true, blockChecked: event.block, lastCheckedAt: new Date()}});
    });
}

app.listen(port, () => {
    console.log(`[worker]: Worker is running at http://localhost:${port}`);
});

worker().then(() => {});