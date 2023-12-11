import React from 'react';
import { Worker } from 'worker_threads'

import config from '@/config.json'
import { OrganizeImportsMode } from 'typescript';
import { Container, List, ListItem } from "@mui/material";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';
import SubLayout from './_sublayout';
import './globals.css';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] }) // TODO

export const metadata: Metadata = {
  title: 'Carbon Flow carbon accounting DAO',
  description: 'An app to account carbon',
};

const worker = new Worker(new URL('../worker/worker.js', import.meta.url))

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="App">
          <Container>
            <h1>Carbon Flow carbon accounting DAO</h1>
            <SubLayout>{children}</SubLayout>
          </Container>
        </div>
      </body>
    </html>
  )
}
