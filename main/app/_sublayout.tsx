'use client'

import '@/app/globals.css'
import { createPublicClient, http } from 'viem'
import { gnosis } from '@wagmi/chains'
import type { AppProps } from 'next/app'
import { createContext, useEffect, useState } from 'react'
import { WagmiProvider, createConfig } from 'wagmi'
// import { watchSigner } from '@wagmi/core'
import { getDefaultProvider } from 'ethers'
import { ColonyNetwork } from '@colony/sdk';
import { SessionProvider, getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
// import { publicProvider } from 'wagmi/providers/public'
import SubLayout2 from './_sublayout2'

// const { publicClient } = configureChains([gnosis], [w3mProvider({ projectId: "" })])
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId: "", chains: [gnosis] }),
//   publicClient,
// })
// const ethereumClient = new EthereumClient(wagmiConfig, [gnosis]);
// const web3modal = new Web3Modal({ projectId }, ethereumClient)

// const { publicClient, webSocketPublicClient } = configureChains(
//   [gnosis],
//   [/*publicProvider()*/],
// );
const config = createConfig({
  chains: [gnosis],
  transports: {
    [gnosis.id]: http(),
  },
  // webSocketPublicClient,
  // autoConnect: true,
});
// const web3modal = new Web3Modal({ projectId }, ethereumClient)

const colonyContextObj: { colonyNetwork: ColonyNetwork | null } = {
  colonyNetwork: null
}

// TODO
// watchSigner({}, async (signer) => {
//   if (!signer) {
//     return;
//   }
//   colonyContextObj.colonyNetwork = new ColonyNetwork(signer)
// })

export default function SubLayout({ children }: { children: any }) { // TODO: type
  const [session, setSession] = useState<Session | undefined>();
  useEffect(() => {
    getSession().then(s => {
      console.log("setSession");
      setSession(s!)
    });
  }, []);

  return (
    <WagmiProvider config={config}>
      <SessionProvider session={session}>
        <SubLayout2>{children}</SubLayout2>
      </SessionProvider>
    </WagmiProvider>
  );
}