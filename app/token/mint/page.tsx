import { useEffect, useState } from "react";

import EthAmount from "@/components/EthAmount";
import { Button } from "@mui/material";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

export default async function Mint(props: {}) {
    const router = useRouter();

    const organizationId0 = router.query.organizationId;
    const organizationId = parseInt(organizationId0 as string);

    const [token, setToken] = useState<bigint | undefined>(undefined);
    const [amount, setAmount] = useState<bigint | undefined>(undefined);

    const prisma = new PrismaClient();
    const tokens0 = await prisma.organizationsTokens.findMany({
        select: {token: { select: { id: true } }, comment: true},
        where: { organizationId },
    });
    const tokens = tokens0.map(t => { return {id: t.token.id, comment: t.comment} });

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