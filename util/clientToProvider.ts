// TODO: This file is unused.

import { type Config, getClient } from '@wagmi/core'
import { providers } from 'ethers'
import { useMemo } from 'react'
import type { Chain, Client, Transport } from 'viem'

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new providers.JsonRpcProvider(value?.url, network),
    )
    if (providers.length === 1) return providers[0]
    return new providers.FallbackProvider(providers)
  }
  return new providers.JsonRpcProvider(transport.url, network)
}

export function getEthersProvider(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = getClient(config, { chainId })
  return clientToProvider(client)
}
