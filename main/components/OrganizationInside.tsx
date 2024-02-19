"use client";

import { Button } from "@mui/material";
import { ethers } from "ethers";
import { encode } from "html-entities";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrganizationInside(props: {
    tokens: {
        id: number,
        comment: string,
        tax: ethers.BigNumber,
    }[];
}) {
    function removeToken(tokenId: number) {
        // TODO
    }
    return <>
        <p>List of organization&apos;s carbon tokens (usually, should consist of one element):</p>
        {props.tokens.length ?
            <ul>
                {props.tokens.map(t =>
                    <li key={t.id}>Token {t.id}/{t.id+1} {t.comment !== undefined ? `(${encode(t.comment)})` : ""}
                        {" "}<Link href={`/token/tax/${t.id}`}>{t.tax * 100}% tax</Link>
                        {" "}<Link href={`/mint/${t.id}`}>mint</Link>,
                        <Link href={`/conversions/${t.id}`}>conversions</Link>,
                        <Button onClick={() => removeToken(t.id)}>propose to remove</Button> {/* TODO: onClick */}
                    </li>
                )}
            </ul> : <p>(none)</p>}
        <p>Propose: <Button>Create new token</Button>, <Button>Add existing token (advanced)</Button></p>
    </>
}