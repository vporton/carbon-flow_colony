import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";

export default async function Conversions(props: {}) {
    type ParentToken = {id: number, comment: string, childs: {id: number, comment: string}[]};

    const router = useRouter()

    const organizationId0 = router.query.organizationId;

    let organizationId = parseInt(organizationId0 as string);
    const prisma = new PrismaClient();
    let r: ParentToken = await prisma.token.findMany({
      select: {
        childs: {
          select: {
            child: {
              select: {
                id: true,
                organizations: {select: {organizationId: true, comment: true}, where: {organizationId}},
              },
            },
          },
        },
        organizations: {select: {organizationId: true, comment: true}, where: {organizationId}},
      },
    });

    return (
        <ul>
            {r.map(parent =>
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