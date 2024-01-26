import { PrismaClient } from "@prisma/client";
import OrganizationInside from "@/../main/components/OrganizationInside";
import { abi as CarbonAbi } from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import CarbonInfo from "@porton/carbon-flow/artifacts/Carbon.deployed.json";
import { ethers } from "ethers";

export default async function Organization({
    params,
    // searchParams,
  }: {
    params: { id: string };
    // searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    const id0 = params!.id;
    const id = parseInt(id0 as string);

    const prisma = new PrismaClient();
    const tokens0 = await prisma.organizationsTokens.findMany({
        select: {token: { select: { id: true } }, comment: true},
        where: { organizationId: { equals: id } },
    });
    const contract = new ethers.Contract(CarbonInfo["31337"].address, CarbonAbi); // FIXME: Specify the chain.
    const tokens1 = tokens0.map(t => ({
      id: t.token.id,
      comment: t.comment,
      taxPromise: contract.taxes(t.token.id),
    }));
    const tokens = await Promise.all(tokens1.map(async t => ({
      id: t.id,
      comment: t.comment,
      tax: await t.taxPromise,
    })));

    let colonyInfo = await prisma.organization.findFirstOrThrow({
      select: { name: true, colonyNickName: true, colonyAddress: true },
      where: { id },
    });

    return (
        <>
            <h2>Organization</h2>
            <p>Name: {colonyInfo.name}</p>
            <p><a href={colonyInfo.colonyNickName === undefined ? undefined : `https://xdai.colony.io/colony/${encodeURIComponent(colonyInfo.colonyNickName)}`}>Colony link</a></p>
            <OrganizationInside tokens={tokens}/>
       </>
    );
}