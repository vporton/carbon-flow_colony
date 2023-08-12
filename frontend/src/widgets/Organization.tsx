import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { ColonyNetwork } from '@colony/sdk';
import { useWalletClient } from 'wagmi';
import { encode } from 'html-entities';

import config from "../config.json";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Organization(props: {}) {
    const [name, setName] = useState("");
    const [nickName, setNickName] = useState("");
    const [colonyAddress, setColonyAddress] = useState("");
    const [tax, setTax] = useState<number | undefined>(undefined);
    const [tokens, setTokens] = useState<{id: number, comment: string}[]>([]);

    const { id }  = useParams();

    useEffect(() => {
        async function doIt() {
            async function fetchStrings() {
                let res = await fetch(config.BACKEND + "/organization/" + encodeURIComponent(id!));
                const { name, nickName, colonyAddress }: { name: string, nickName: string, colonyAddress: string } = res.body as any;
                setName(name);
                setNickName(nickName);
                setColonyAddress(colonyAddress);
                // TODO: Fetch tax.
            }
            async function fetchTokens() {
                let res = await fetch(config.BACKEND + "/organization-tokens");
                setTokens(res as any);
            }
            await Promise.all([fetchStrings(), fetchTokens()]);
        }
        doIt().then(() => {});
    }, [id]);

    return (
        <>
            <h2>Organization</h2>
            <p>Name: {name}</p>
            <p><a href={nickName === undefined ? undefined : `https://xdai.colony.io/colony/${encodeURIComponent(nickName)}`}>Colony link</a></p>
            <p><q>Tax</q> {tax !== undefined ? tax*100 : "(loading)"}% <Button>Propose to change</Button></p>
            <p>List of organization's carbon tokens (usually, should consist of one element):</p>
            {tokens.length ?
                <ul>
                    {tokens.map(t => <li>Token {t.id}/{t.id+1} {t.comment !== undefined ? `(${encode(t.comment)})` : ""}
                        {" "}(
                            <Link to={`/mint/${t.id}`}>mint</Link>,
                            <Link to={`/conversions/${t.id}`}>conversions</Link>,
                            <Button>propose to remove</Button> {/* TODO: onClick */}
                        )
                        </li>)}
                </ul> : <p>(none)</p>}
            <p>Propose: <Button>Create new token</Button>, <Button>Add existing token (advanced)</Button></p>
       </>
    );
}