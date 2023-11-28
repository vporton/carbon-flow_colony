import { useEffect, useState } from "react";

import EthAmount from "@/components/EthAmount";
import { Button } from "@mui/material";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import MintInside from "@/components/MintInside";

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