import { Autocomplete, Button, TextField } from '@mui/material';
import { PrismaClient } from '@prisma/client';
import AutocompleteOrganization from './_autocompleteOrganization';

import config from '@/config.json';
import Link from 'next/link';

export default async function Organization(props: {}) {
    const prisma = new PrismaClient();
    const userId = 1; // FIXME
    const myOrgs = await prisma.organization.findMany({select: {id: true, name: true, users: {select: {userId: true}, where: {userId}} }});

    return (
        <>
            <p>Organizations that you joined:</p>
            {myOrgs.length === 0 ? <p><em>(none)</em></p> :
                <ul>
                    {myOrgs.map(o => <li key={o.id}><a href={`/organization/${o.id}`}>o.name</a></li>)}
                </ul>}
            <p>To join an organization, start typing its name:</p>
            <p><AutocompleteOrganization/></p>
            <p>
                <Link href="/organization/create">Create a new organization</Link>
            </p>
        </>
    );
}