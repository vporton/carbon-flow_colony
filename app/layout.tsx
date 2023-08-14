import React from 'react';

import config from '@/config.json'
import { OrganizeImportsMode } from 'typescript';
import { Container, List, ListItem } from "@mui/material";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';
import SubLayout from './_sublayout';
import './globals.css';
import { getSession } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] }) // TODO

export const metadata: Metadata = {
  title: 'Carbon Flow carbon accounting DAO',
  description: 'An app to account carbon',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const session = await getSession();
  // const userEmail = session?.user?.email;

  function Logout(props: {refreshUser: () => void}) {
    async function doLogout() {
      const response = await fetch(config.BACKEND + "/logout", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "include", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow", // manual, *follow, error
      });
      if (response.status === 200) {
          // TODO
      }
    }

    return (
      <button onClick={doLogout}>Logout</button>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="App">
          <Container>
            <h1>Carbon Flow carbon accounting DAO</h1>
            <List style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
              {/* TODO: Clicking outside item does not open the link. */}
              <ListItem><Link href="/login" className="nav-link">Login</Link></ListItem>
              <ListItem><Link href="/register" className="nav-link">Register</Link></ListItem>
              <ListItem><Link href="/" className="nav-link">Organizations</Link></ListItem>
            </List>
            <SubLayout>{children}</SubLayout>
          </Container>
        </div>
      </body>
    </html>
  )
}
