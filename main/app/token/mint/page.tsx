import { useEffect, useState } from "react";

import { PrismaClient } from "@prisma/client";
import MintInside from "@/../../main/components/MintInside";

export default async function Mint({
    params,
    // searchParams,
}: {
    params: { organizationId: number };
    // searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const prisma = new PrismaClient();
    const tokens0 = await prisma.organizationsTokens.findMany({
        select: {token: { select: { id: true } }, comment: true},
        where: { organizationId: { equals: params.organizationId } },
    });
    const tokens = tokens0.map(t => { return {id: t.token.id, comment: t.comment} });

    return <MintInside tokens={tokens}/>
}