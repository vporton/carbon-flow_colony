'use client';

import { Button } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react";
import Carbon from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import { carbonTokenAddress } from "@/../util/data";
import config from "@/../config.json";

export default function Tax(props: {tokenId: number}) {
    const [tax, setTax] = useState<number | undefined>();
    const contract = new ethers.Contract(carbonTokenAddress, Carbon.abi);
    contract.methods.taxes(props.tokenId)
        .then((tax: ethers.BigNumber) => setTax(tax.toNumber() / (2**128)));
    async function update() {
        fetch(config.BACKEND + "/api/token/setTax", { // TODO: Implement in backend.
            method: "POST",
            cache: "no-cache",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({tokenId: props.tokenId, tax}),
        })
            .then(response => {});
    }
    return (
        <> {/* TODO: Show token comment. */}
            <p>Tax for token {props.tokenId}:</p>
            <p><input value={tax !== undefined ? tax * 100 : ""}
                onChange={e => Math.floor(parseFloat((e.target as HTMLInputElement).value) / 100 * 2**128).toString()}/></p>
            <p><Button onClick={update}>Update</Button></p>
        </>
    );
}