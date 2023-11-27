import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { PrismaClient } from "@prisma/client";

export default async function Conversions({
    params,
    // searchParams,
}: {
    params: { organizationId: string };
    // searchParams?: { [key: string]: string | string[] | undefined };
}) {
    type ParentToken = {id: number, comment: string, childs: {tokenId: number, comment: string}[]};

    const organizationId0 = params!.organizationId;

    let organizationId = parseInt(organizationId0 as string);
    const prisma = new PrismaClient();
    let r = await prisma.token.findMany({
      select: {
        id: true,
        childs: {
            select: {
                organization: { select: { tokens: { select: {tokenId: true, comment: true}, where: {organizationId}} } },
            },
            where: {organizationId},
        },
        organizations: {select: {comment: true}, where: {organizationId}},
      },
    });
    let ourTokens: ParentToken[] = r.map(t => {
        return {id: t.id, comment: t.organizations[0].comment, childs: t.childs.map(t2 => t2.organization.tokens[0])};
    });

    return (
        <ul>
            {ourTokens.map(parent =>
                <li key={parent.id}>
                    Token {parent.id} {parent.comment !== undefined ? `(${parent.comment})` : ""}
                    <ul>
                        {parent.childs.map(child =>
                            <li key={child.tokenId}>
                                <a href={`conversion/${child.tokenId}`}>Token {child.tokenId} {child.comment !== undefined ? `(${child.comment})` : ""}</a>
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