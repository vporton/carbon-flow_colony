'use client'

import '@/app/globals.css'
import { createPublicClient, http } from 'viem'
import { gnosis } from '@wagmi/chains'
import type { AppProps } from 'next/app'
import { createContext, useEffect, useState } from 'react'
import { WagmiConfig, configureChains, createClient, createConfig } from 'wagmi'
// import { watchSigner } from '@wagmi/core'
import { getDefaultProvider } from 'ethers'
import { ColonyNetwork } from '@colony/sdk';
import Connect from '@/components/Connect'
import { SessionProvider, getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { Web3Button, useWeb3Modal } from '@web3modal/react'
import { publicProvider } from 'wagmi/providers/public'

// const { publicClient } = configureChains([gnosis], [w3mProvider({ projectId: "" })])
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId: "", chains: [gnosis] }),
//   publicClient,
// })
// const ethereumClient = new EthereumClient(wagmiConfig, [gnosis]);
// const web3modal = new Web3Modal({ projectId }, ethereumClient)

const { publicClient, webSocketPublicClient } = configureChains(
  [gnosis],
  [publicProvider()],
)
const config = createConfig({
  publicClient,
  webSocketPublicClient,
})


const colonyContextObj: { colonyNetwork: ColonyNetwork | null } = {
  colonyNetwork: null
}

export const ColonyContext = createContext(colonyContextObj)

// TODO
// watchSigner({}, async (signer) => {
//   if (!signer) {
//     return;
//   }
//   colonyContextObj.colonyNetwork = new ColonyNetwork(signer)
// })

export default function SubLayout({ children }: { children: any }) { // TODO: type
  const [session, setSession] = useState<Session | undefined>();
  // const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    getSession().then(s => {
      console.log("setSession");
      setSession(s!)
    });
  }, []);

  const { open, close } = useWeb3Modal();

  return (
    <WagmiConfig config={config}>
      {/* <Connect/> - FIXME: Remove the component. */}
      <button onClick={() => open()}>Connect</button>
      <SessionProvider session={session}>
        <p>Username:{" "}
          {session?.user?.email !== undefined ? <>{session?.user?.email} (<button onClick={e => signOut()}>Logout</button>)</> : "(none)"}</p>
        <ColonyContext.Provider value={colonyContextObj}>
          {children}
        </ColonyContext.Provider>
      </SessionProvider>
    </WagmiConfig>
  );
}