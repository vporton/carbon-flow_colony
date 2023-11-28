import { colonyNetwork, ethProvider } from "@/util/serverSideEthConnect";
import { ColonyEventManager } from "@colony/sdk";
import { PrismaClient } from "@prisma/client/extension";
import { IColonyEvents__factory as ColonyEventsFactory } from '@colony/events/types';

async function worker() {
    const prisma = new PrismaClient();
    const txs = await prisma.transaction.findMany(
        {select: {id: true, tx: true, kind: true, blockChecked: true}, where: {confirm: false}}
    );
    
    const manager = new ColonyEventManager(ethProvider);
    // const colonyAddedEventSource = eventManager.createEventSource(ColonyAdded);
    // const colonyAddedFilter = eventManager.createFilter(colonyAddedEventSource, "ColonyAdded");
    // Here is an example: https://github.com/JoinColony/colonyJS/blob/main/packages/sdk/examples/browser/src/events.ts
    // See lines 35 and 36 in the above example
    const colonyEventSource = manager.createEventSource(ColonyEventsFactory);

    // const domainEvents = manager.createMultiFilter(
    //     colonyEventSource,
    //     ['DomainAdded(address,uint256)', 'DomainMetadata(address,uint256,string)'],
    //     colonyAddress,
    //   );
    
    // TODO
    // manager.provider.on('block', async (no) => {
    //     manager.
    // });

    for (const transaction in txs) {
        // colonyNetwork.
    }
}

worker().then(() => {});