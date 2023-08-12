import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import config from "../config.json";
import { Button } from "@mui/material";

export default function Conversions(props: {}) {
    type ParentToken = {id: number, comment: string, childs: {id: number, comment: string}[]};

    const { organization } = useParams();

    const [ourTokens, setOurTokens] = useState<ParentToken[]>([]);

    useEffect(() => {
        async function doIt() {
            let res = await fetch(config.BACKEND + "/tokens-with-childs/" + encodeURIComponent(organization!));
            setOurTokens(res.body as any);
        }
        doIt().then(() => {});
    });

    return (
        <ul>
            {ourTokens.map(parent =>
                <li>
                    Token {parent.id} {parent.comment !== undefined ? `(${parent.comment})` : ""}
                    <ul>
                        {parent.childs.map(child =>
                            <li>
                                <a href={`conversion/${child.id}`}>Token {child.id} {child.comment !== undefined ? `(${child.comment})` : ""}</a>
                                <Button>Reset and remove child</Button>
                            </li>
                        )}
                        <li><Button>Add new child</Button></li>
                    </ul>
                </li>
            )}            
        </ul>
    );
}