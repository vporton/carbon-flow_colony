'use client'

import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { ColonyNetwork, SignerOrProvider } from '@colony/sdk';
import { useWalletClient } from "wagmi";
// import { useWalletClient } from 'wagmi';
import { useEthersSigner } from "@/../../util/clientToSigner";
import config from "@/../config.json";

export default function CreateOrganization(props: {}) {
    const signer = useEthersSigner();

    const [busy, setBusy] = useState(false);
    const [colonyName, setColonyName] = useState("");
    const [colonyNickName, setColonyNickName] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");

    function create() {
        async function doIt() {
            const _response = await fetch(config.BACKEND + "/api/organization/create", {
                method: "POST",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationName: colonyName,
                    colonyNickName,
                    tokenName,
                    tokenSymbol,
                }),
            });
        }
        doIt().then(()=>{});
    }

    return (
        <>
            <h2>Create organization</h2>
            <p>Here you create an organization (<q>colony</q>) and its token (this token is <em>not</em> the carbon counting token).</p>
            <p><strong>Warning: After creating an organization, you cannot change the below data!</strong></p>
                <p>Organization name:<br/>
                <input value={colonyName} onChange={(e) => setColonyName(e.target.value)} disabled={busy}/></p>
            <p>Organization nickname (recommended only lowercase letters):<br/>
                <input value={colonyNickName} onChange={(e) => setColonyNickName(e.target.value)} disabled={busy}/></p>
            <p>Token name:<br/>
                <input value={tokenName} onChange={(e) => setTokenName(e.target.value)} disabled={busy}/></p>
            <p>Token symbol (recommended a short string of uppercase letters):<br/>
                <input value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} disabled={busy}/></p>
            <p>
                <Button disabled={busy || (colonyNickName === '' || tokenName === '' || tokenSymbol === '')} onClick={create}>Create</Button>
                <CircularProgress style={{display: busy ? 'inline-block' : 'none'}}/>
            </p>
        </>
    );
}