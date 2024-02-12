"use client";

import { Autocomplete, Button, CircularProgress, TextField } from '@mui/material';
import { PrismaClient } from '@prisma/client';
import AutocompleteOrganization from './_autocompleteOrganization';
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link';
import { redirect } from 'next/navigation'
import config from '@/../config.json';
import { useEffect, useState } from 'react';
import { getServerSession } from 'next-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Organization(props: {}) {
    const prisma = new PrismaClient();
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    if (!userEmail) {
        redirect("/login");
    }
    const [myOrgs, setMyOrgs] = useState<{id: number, name: string}[]>([]);

    function refreshUserOrganizations() {
        prisma.organization.findMany({select: {id: true, name: true, users: {select: {userEmail: true}, where: {userEmail: userEmail!}} }})
            .then(data => setMyOrgs(data));
    }

    return (
        <>
            <p>Organizations that you joined:</p>
            {/* TODO: Make the <ul> a separate widget. */}
            {myOrgs.length === 0 ? <p><em>(none)</em></p> :
                <ul>
                    {myOrgs.map((o: any) => <li key={o.id}><a href={`/organization/${o.id}`}>o.name</a></li>)} {/* TODO: `any` */}
                </ul>}
            <p>To join an organization, start typing its name:</p>
            <AutocompleteOrganization onRefreshUserOrganizations={refreshUserOrganizations}/>
            <p>
                <Link href="/organization/create">Create a new organization</Link>
            </p>
        </>
    );
}