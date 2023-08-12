import { useEffect, useState } from "react";

import config from "../config.json";
import EthAmount from "./EthAmount";
import { Button } from "@mui/material";

export default function Mint(props: {}) {
    const [tokens, setTokens] = useState<{id: number, comment: string}[]>([]);
    const [token, setToken] = useState<bigint | undefined>(undefined);
    const [amount, setAmount] = useState<bigint | undefined>(undefined);

    async function fetchTokens() {
        let res = await fetch(config.BACKEND + "/organization-tokens");
        setTokens(res as any);
    }

    useEffect(() => {
        fetchTokens().then(() => {});
    });

    function mint() {
        // TODO
    }

    return (
        <>
            <p>Token:
                <select value={token !== undefined ? token.toString() : ""} onChange={e => setToken(e.target.value as unknown as bigint)}>
                    <option>-</option>
                {tokens.map(t =>
                    <optgroup label={`${t.id}/${t.id+1}` + (t.comment !== undefined ? `(${t.comment})` : "")}>
                        <option value={t.id}>Non-retired ({t.id})</option>
                        <option value={t.id+1}>Retired ({t.id+1})</option>
                    </optgroup>
                )}
                </select>
            </p>
            <p>Amount: <EthAmount value={amount} onChange={setAmount}/></p>
            <p><Button onClick={mint} disabled={token !== undefined && amount !== undefined}>Mint!</Button></p>
        </>
    )
}