import CarbonInfo from "@porton/carbon-flow/artifacts/Carbon.deployed.json";

export const carbonTokenAddress: string = (CarbonInfo as {[chain: string] : any})[process.env.CHAIN_ID!].address;