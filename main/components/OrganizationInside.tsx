"use client";

import { Button } from "@mui/material";
import { Prisma, PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import { encode } from "html-entities";
import Link from "next/link";
import { useEffect, useState } from "react";
import { colonyNetwork } from "../../util/serverSideEthConnect";
import { bufferToEthAddress } from "../../util/eth";
import config from "@/../config.json";

export default function OrganizationInside(props: {
    tokens: {
        id: number,
        comment: string,
        tax: ethers.BigNumber,
    }[] | undefined,
    colonyId: number,
}) {
    async function removeToken(tokenId: number) { // TODO: Ask confirmation.
        fetch(config.BACKEND + "/api/token/remove", {
            method: "POST",
            cache: "no-cache",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({organizationId: props.colonyId, tokenId}),
        })
            .then(response => {
                if (response.status === 200) {
                    window.location.reload();
                }
            });
      }
    return <>
        <p>List of organization&apos;s carbon tokens (usually, should consist of one element):</p>
        {(props.tokens || []).length ?
            <ul>
                {(props.tokens || []).map(t =>
                    <li key={t.id}>Token {t.id}/{t.id+1} {t.comment !== undefined ? `(${encode(t.comment)})` : ""}
                        {" "}<Link href={`/token/tax/${t.id}`}>{t.tax.toNumber() / (2**128) * 100}% tax</Link>
                        {" "}<Link href={`/mint/${t.id}`}>mint</Link>,
                        <Link href={`/conversions/${t.id}`}>conversions</Link>,
                        <Button onClick={() => removeToken(t.id)}>propose to remove</Button>
                    </li>
                )}
            </ul> : <p>(none)</p>}
        <p>Propose: <Button>Create new token</Button>, <Button>Add existing token (advanced)</Button></p>
    </>
}