"use client";

import { useState } from "react";
import EthAmount from "./EthAmount";
import { Button } from "@mui/material";
import config from "@/../config.json"
import { useEthersSigner } from "../../util/clientToSigner";

export default function MintInside(props: {
    tokens: {
        id: number,
        comment: string,
    }[],
    organization: number,
}) {
    const signer = useEthersSigner();

    const [token, setToken] = useState<bigint | undefined>(undefined);
    const [amount, setAmount] = useState<bigint | undefined>(undefined);

    async function mint() {
        fetch(config.BACKEND + "/api/token/mint", {
            method: "POST",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token, amount, to: await signer?.getAddress(), organizationId: props.organization}),
        })
            .then(response => {
                if (response.status === 200) {
                    // TODO
                }
            });
    }

    return <>
        <p>Token:
            <select value={token !== undefined ? token.toString() : ""} onChange={e => setToken(e.target.value as unknown as bigint)}>
                <option>-</option>
            {props.tokens.map(t =>
                <optgroup key={t.id} label={`${t.id}/${t.id+1}` + (t.comment !== undefined ? `(${t.comment})` : "")}>
                    <option value={t.id}>Non-retired ({t.id})</option>
                    <option value={t.id+1}>Retired ({t.id+1})</option>
                </optgroup>
            )}
            </select>
        </p>
        <p>Amount: <EthAmount value={amount} onChange={setAmount}/></p> {/* FIXME: not in wei */}
        <p><Button onClick={mint} disabled={token !== undefined && amount !== undefined}>Mint!</Button></p>
    </>
}