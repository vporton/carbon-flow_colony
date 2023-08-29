import { colonyNetwork, ethProvider } from "@/util/serverSideEthConnect";
import { ColonyEventManager } from "@colony/sdk";
import { PrismaClient } from "@prisma/client/extension";
import { ColonyAdded__factory as ColonyAdded } from "@colony/events";

async function worker() {
    const prisma = new PrismaClient();
    const txs = await prisma.transaction.findMany(
        {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirm: false}}
    );
    
    const eventManager = new ColonyEventManager(ethProvider);
    const colonyAddedEventSource = eventManager.createEventSource(ColonyAdded);
    const colonyAddedFilter = eventManager.createFilter(colonyAddedEventSource, "ColonyAdded");
    // Here is an example: https://github.com/JoinColony/colonyJS/blob/main/packages/sdk/examples/browser/src/events.ts
    // See lines 35 and 36 in the above example

    for (const transaction in txs) {
        colonyNetwork.
    }
}

worker().then(() => {});