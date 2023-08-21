'use client'

import { Button } from "@mui/material";
import { useState } from "react";
import { ColonyNetwork, SignerOrProvider } from '@colony/sdk';
import { useWalletClient } from "wagmi";
// import { useWalletClient } from 'wagmi';

export default function CreateOrganization(props: {}) {
    const { data: signer } = useWalletClient();
    // useProvider()

    const [colonyName, setColonyName] = useState("");
    const [colonyNickName, setColonyNickName] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");

    function create() {
        async function doIt() {
            const colonyNetwork = new ColonyNetwork(signer as unknown as SignerOrProvider); // FIXME

            // const response = await fetch(config.BACKEND + "/login", {
            //     method: "POST",
            //     cache: "no-cache",
            //     credentials: "include",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         name: colonyName,
            //         colonyNickName,
            //         colonyAddress,
            //         tokenAddress,
            //         tokenAuthorityAddress,
            //     }),
            // });
            // if (response.status === 200) {
            //     navigate(`/organization`); // FIXME
            // }
            // TODO
        }
        doIt().then(()=>{});
    }

    return (
        <>
            <h2>Create organization</h2>
            <p>Here you create an organization (<q>colony</q>) and its token (this token is <em>not</em> the carbon counting token).</p>
            <p><strong>Warning: After creating an organization, you cannot change the below data!</strong></p>
            <p>Organization name:{" "}
                <input value={colonyName} onChange={(e) => setColonyName(e.target.value)}/>
            </p>
            <p>Organization nickname (recommended only lowercase letters):{" "}
                <input value={colonyNickName} onChange={(e) => setColonyNickName(e.target.value)}/>
            </p>
            <p>Token name: <input value={tokenName} onChange={(e) => setTokenName(e.target.value)}/></p>
            <p>Token symbol (recommended a short string of uppercase letters):{" "}
                <input value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)}/></p>
            <p><Button disabled={colonyNickName === '' || tokenName === '' || tokenSymbol === ''} onClick={create}>Create</Button></p>
        </>
    );
}