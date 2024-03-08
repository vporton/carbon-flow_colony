import { PrismaClient } from "@prisma/client";
import OrganizationInside from "@/../main/components/OrganizationInside";
import Carbon from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import { carbonTokenAddress } from "@/../util/data";
import { ethers } from "ethers";
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import config from "@/../config.json";
import { useEffect, useState } from "react";

export default function Organization({
    params,
    // searchParams,
  }: {
    params: { id: string };
    // searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    const id0 = params!.id;
    const id = parseInt(id0 as string);

    const navigate = useNavigate();

    const [tokens, setTokens] = useState<{id: number; comment: string; tax: ethers.BigNumber}[] | undefined>();
    const [colonyInfo, setColonyInfo] = useState<{name: string; colonyNickName: string} | undefined>();

    const prisma = new PrismaClient();
    useEffect(() => {
      prisma.organizationsTokens.findMany({
          select: {token: { select: { id: true } }, comment: true},
          where: { organizationId: { equals: id } },
      }).then(async tokens0 => {
        const contract = new ethers.Contract(carbonTokenAddress, Carbon.abi);
        const tokens1 = tokens0.map(t => ({
          id: t.token.id,
          comment: t.comment,
          taxPromise: contract.taxes(t.token.id),
        }));
        const tokens2 = await Promise.all(tokens1.map(async t => ({
          id: t.id,
          comment: t.comment,
          tax: await t.taxPromise,
        })));
        setTokens(tokens2);
      });

      prisma.organization.findFirstOrThrow({
        select: { name: true, colonyNickName: true, colonyAddress: true },
        where: { id },
      }).then((colonyInfo) => setColonyInfo(colonyInfo));
    });

    function unjoinOrganization() {
      fetch(config.BACKEND + "/api/organization/join", {
          method: "POST",
          cache: "no-cache",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({organizationId: id, flag: false}),
      })
          .then(response => {
              if (response.status === 200) {
                  navigate("/");
              }
          });
  }

  return (
        <>
            <h2>Organization</h2>
            {/* TODO: Ask confirmation for unjoin. */}
            <p>Name: {colonyInfo === undefined ? "(loading)" : colonyInfo.name} <Button onClick={() => unjoinOrganization()}>Unjoin</Button></p>
            <p><a href={colonyInfo === undefined ? undefined : `https://xdai.colony.io/colony/${encodeURIComponent(colonyInfo.colonyNickName)}`}>Colony link</a></p>
            <OrganizationInside tokens={tokens} colonyId={id}/>
       </>
    );
}