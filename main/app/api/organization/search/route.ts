import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

async function GET(req: Request) {
    const j = await req.json()
    const prefix: string = j.prefix ?? "";
    const maxValues: number =  j.max ?? 50; // limit against DoS attacks.
    const prisma = new PrismaClient();
    const organizations = await prisma.organization.findMany(
    {select: {id: true, name: true}, where: {name: {startsWith: prefix}}, take: maxValues});
    return NextResponse.json(organizations);
}

export { GET };