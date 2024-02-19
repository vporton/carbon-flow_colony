import { Button } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react";
import Carbon from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import CarbonInfo from "@porton/carbon-flow/artifacts/Carbon.deployed.json";

export default function Tax(params: {tokenId: number}) {
    const [tax, setTax] = useState<number | undefined>();
    const contract = new ethers.Contract(CarbonInfo["31337"].address, Carbon.abi); // FIXME: Specify the chain. // TODO: duplicate code
    contract.methods.taxes(params.tokenId)
        .then((tax: ethers.BigNumber) => setTax(tax.toNumber() / (2**128)));
    async function update() {
        await contract.methods.setTax(params.tokenId, tax);
    }
    return (
        <> {/* TODO: Show token comment. */}
            <p>Tax for token {params.tokenId}:</p>
            <p><input value={tax !== undefined ? tax * 100 : ""}
                onChange={e => Math.floor(parseFloat((e.target as HTMLInputElement).value) / 100 * 2**128).toString()}/></p>
            <p><Button onClick={update}>Update</Button></p>
        </>
    );
}