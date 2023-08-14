import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Connect() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(), // TODO: Bug if MetaMask isn't installed.
  });
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <>
        <button onClick={() => disconnect()}>Disconnect</button>
        {" "}{address}
      </>
    );
  } else {
    return <button onClick={() => connect()}>Connect</button>
  }
}

export default Connect