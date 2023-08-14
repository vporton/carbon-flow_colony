import { Autocomplete, Button, TextField } from '@mui/material';
import { PrismaClient } from '@prisma/client';
import AutocompleteOrganization from './_autocompleteOrganization';
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link';
import { redirect } from 'next/navigation'
import config from '@/config.json';
import { useEffect } from 'react';
import { getServerSession } from 'next-auth';

export default async function Organization(props: {}) {
    const prisma = new PrismaClient();
    const session = await getServerSession();
    const userEmail = session?.user?.email;
    if (!userEmail) {
        redirect("/login");
    }
    const myOrgs = await prisma.organization.findMany({select: {id: true, name: true, users: {select: {userEmail: true}, where: {userEmail: userEmail!}} }});

    return (
        <>
            <p>Organizations that you joined:</p>
            {myOrgs.length === 0 ? <p><em>(none)</em></p> :
                <ul>
                    {myOrgs.map(o => <li key={o.id}><a href={`/organization/${o.id}`}>o.name</a></li>)}
                </ul>}
            <p>To join an organization, start typing its name:</p>
            <AutocompleteOrganization/>
            <p>
                <Link href="/organization/create">Create a new organization</Link>
            </p>
        </>
    );
}