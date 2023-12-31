"use client";

import { Button } from "@mui/material";
import { encode } from "html-entities";
import Link from "next/link";
import { useState } from "react";

export default function OrganizationInside(props: {
    tokens: {
        id: number;
        comment: string;
    }[];
}) {
    const [tax, setTax] = useState<number | undefined>(); // TODO

    return <>
        <p><q>Tax</q> {tax !== undefined ? tax*100 : "(loading)"}% <Button>Propose to change</Button></p>
        <p>List of organization&apos;s carbon tokens (usually, should consist of one element):</p>
        {props.tokens.length ?
            <ul>
                {props.tokens.map(t => <li key={t.id}>Token {t.id}/{t.id+1} {t.comment !== undefined ? `(${encode(t.comment)})` : ""}
                    {" "}(
                        <Link href={`/mint/${t.id}`}>mint</Link>,
                        <Link href={`/conversions/${t.id}`}>conversions</Link>,
                        <Button>propose to remove</Button> {/* TODO: onClick */}
                    )
                    </li>)}
            </ul> : <p>(none)</p>}
        <p>Propose: <Button>Create new token</Button>, <Button>Add existing token (advanced)</Button></p>
    </>
}