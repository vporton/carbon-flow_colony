import { Button } from "@mui/material";
import { encode } from 'html-entities';
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";

export default async function Organization(props: {}) {
    const router = useRouter();

    const id0 = router.query.id;
    const id = parseInt(id0 as string);

    const tax = 0; // FIXME
    const prisma = new PrismaClient();
    const tokens0 = await prisma.organizationsTokens.findMany({
        select: {token: { select: { id: true } }, comment: true},
        where: { organizationId: id },
    });
    const tokens = tokens0.map(t => { return {id: t.token.id, comment: t.comment} });

    let colonyInfo = await prisma.organization.findFirstOrThrow({
      select: { name: true, colonyNickName: true, colonyAddress: true },
      where: { id },
    });

    return (
        <>
            <h2>Organization</h2>
            <p>Name: {colonyInfo.name}</p>
            <p><a href={colonyInfo.colonyNickName === undefined ? undefined : `https://xdai.colony.io/colony/${encodeURIComponent(colonyInfo.colonyNickName)}`}>Colony link</a></p>
            <p><q>Tax</q> {tax !== undefined ? tax*100 : "(loading)"}% <Button>Propose to change</Button></p>
            <p>List of organization's carbon tokens (usually, should consist of one element):</p>
            {tokens.length ?
                <ul>
                    {tokens.map(t => <li>Token {t.id}/{t.id+1} {t.comment !== undefined ? `(${encode(t.comment)})` : ""}
                        {" "}(
                            <Link href={`/mint/${t.id}`}>mint</Link>,
                            <Link href={`/conversions/${t.id}`}>conversions</Link>,
                            <Button>propose to remove</Button> {/* TODO: onClick */}
                        )
                        </li>)}
                </ul> : <p>(none)</p>}
            <p>Propose: <Button>Create new token</Button>, <Button>Add existing token (advanced)</Button></p>
       </>
    );
}