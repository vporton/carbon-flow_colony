'use client'

import '@/app/globals.css'
import { createPublicClient, http } from 'viem'
import { gnosis } from '@wagmi/chains'
import type { AppProps } from 'next/app'
import { createContext, useState } from 'react'
import { WagmiConfig, createClient } from 'wagmi'
import { watchSigner } from '@wagmi/core'
import { getDefaultProvider } from 'ethers'
import { ColonyNetwork } from '@colony/sdk';
import Connect from '@/components/Connect'
import { SessionProvider, getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const client = createClient({
  // FIXME: how to do autoConnect?
  autoConnect: false,
  provider: getDefaultProvider(),
})

const colonyContextObj: { colonyNetwork: ColonyNetwork | null } = {
  colonyNetwork: null
}

export const ColonyContext = createContext(colonyContextObj)

watchSigner({}, async (signer) => {
  if (!signer) {
    return;
  }
  colonyContextObj.colonyNetwork = new ColonyNetwork(signer)
})

export default function SubLayout({ children }: { children: any }) { // TODO: type
  const [session, setSession] = useState<Session | undefined>();
  getSession().then(s => setSession(s!));

  return (
    <WagmiConfig client={client}>
      <Connect/>
      <SessionProvider session={session}>
        <p>Username: {session?.user?.email !== null ? (<>{session?.user?.email} ({/*<Logout refreshUser={refreshUser}/>*/})</>) : "(none)"}</p>
        <ColonyContext.Provider value={colonyContextObj}>
          {children}
        </ColonyContext.Provider>
      </SessionProvider>
    </WagmiConfig>
  );
}