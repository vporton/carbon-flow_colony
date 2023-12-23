import { ColonyNetwork } from '@colony/sdk';
import { ethers } from 'ethers';

// export const ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_NODE_HTTP_URL!)
export const ethProvider = new ethers.providers.WebSocketProvider(process.env.ETHEREUM_NODE_WS_URL!)
export const ethSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, ethProvider);

export const colonyNetwork = new ColonyNetwork(ethSigner);
