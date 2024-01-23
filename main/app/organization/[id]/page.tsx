import { PrismaClient } from "@prisma/client";
import OrganizationInside from "@/../main/components/OrganizationInside";

export default async function Organization({
    params,
    // searchParams,
  }: {
    params: { id: string };
    // searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    const id0 = params!.id;
    const id = parseInt(id0 as string);

    const tax = 0; // FIXME
    const prisma = new PrismaClient();
    const tokens0 = await prisma.organizationsTokens.findMany({
        select: {token: { select: { id: true } }, comment: true},
        where: { organizationId: { equals: id } },
    });
    const tokens1 = tokens0.map((t: any) => {
      return {
        id: t.token.id,
        comment: t.comment,
        // taxPromise: 
      };
    }); // TODO: `any`

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