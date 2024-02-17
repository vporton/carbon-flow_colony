"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors' 

function Connect() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // TODO: Bug if MetaMask isn't installed.
  const connector = injected({ target: 'metaMask' });
  return (
    <>
    {
      isConnected ? 
      <><button onClick={() => disconnect()}>Disconnect</button>{" "}{address}</> :
      <><button onClick={() => connect({connector})}>Connect</button></>
    }
    </>
  );
}

export default Connect