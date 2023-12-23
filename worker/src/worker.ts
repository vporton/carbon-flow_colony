import { colonyNetwork, ethProvider } from "@/../util/serverSideEthConnect";
import { ColonyEventManager } from "@colony/sdk";
import { PrismaClient } from "@prisma/client/extension";
import { IColonyEvents__factory as ColonyEventsFactory } from '@colony/events';
import { utils } from "ethers";
import { TransactionKind } from "@/../util/transactionKinds";
import { ethAddressToBuffer } from "@/../util/eth";

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config({ path: '../../.env' });

console.log("XXX")

const app: Express = express();
const port = process.env.WORKER_PORT || 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[worker]: Server is running at http://localhost:${port}`);
});

async function worker() {
    // const prisma = new PrismaClient();
    
//     const manager = new ColonyEventManager(ethProvider);
//     // TODO: Remove the below commented out code.
//     // const colonyAddedEventSource = eventManager.createEventSource(ColonyAdded);
//     // const colonyAddedFilter = eventManager.createFilter(colonyAddedEventSource, "ColonyAdded");
//     // Here is an example: https://github.com/JoinColony/colonyJS/blob/main/packages/sdk/examples/browser/src/events.ts
//     // See lines 35 and 36 in the above example
//     const colonyEventSource = manager.createEventSource(ColonyEventsFactory);

//     // const ourEvents = manager.createMultiFilter(
//     //     colonyEventSource,
//     //     ['ColonyAdded(uint256,address,address)'], // FIXME
//     //     // colonyAddress,
//     // );

//     // Ethers provider
//     const provider = colonyNetwork.getInternalNetworkContract().provider; // That should work, but it is not elegant.

//     async function processEvent(event: any, id: number, kind: TransactionKind) {
//         switch (kind) {
//             case TransactionKind.CREATE_ORGANIZATION:
//                 const {name, colonyNickName} = prisma.createNewOrganizationTransaction.findFirstOrThrow({
//                     select: {tokenName: true, tokenSymbol: true, colonyNickName: true, name: true},
//                     where: {transaction: id},
//                 })
//                 prisma.organization.create({
//                     name,
//                     colonyNickName,
//                     colonyAddress: ethAddressToBuffer(event.args.colonyAddress),
//                     token: ethAddressToBuffer(event.args.tokenAddress),
//                     tokenAuthorityAddress: ethAddressToBuffer("0x0"), // FIXME                  
//                 });
//                 break;
//         }
//     }

//     // TODO: Remove old events.

//     // TODO: Process remaining events on startup.
//     // const txs = await prisma.transaction.findMany(
//     //     {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirm: false}}
//     // );
    
//     const filter = {
//         // address: THE_ADDRESS_OF_YOUR_CONTRACT,
//         // topics: [
//         //     utils.id('ColonyAdded(uint256,address,address)')
//         // ],
//     };
//     provider.on(filter, async (_log, event) => { // FIXME: Is `async` supported here?
//         const transactionHash = event.transactionHash; // TODO: correct?
//         const { id, kind } = await prisma.transaction.findFirstOrThrow(
//             // TODO: Are all `select` args necessary?
//             {select: {id: true, kind: true, blockChecked: true}, where: {confirm: false, tx: transactionHash}} // FIXME
//         );
//         await processEvent(event, id, kind);
//         // TODO: Is `event.block` a correct field?
//         // TODO: Should use the function `NOW` instead of `new Date()`.
//         await prisma.transaction.update({where: {id}, data: {confirmed: true, blockChecked: event.block, lastCheckedAt: new Date()}});
//     });
}

worker().then(() => {});