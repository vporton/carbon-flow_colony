'use client'

import Connect from "@/components/Connect";
import { useSession } from "next-auth/react";
import { createContext } from "react";

export default function SubLayout2({ children }: { children: any }) {
    const session = useSession();
    // export const ColonyContext = createContext(colonyContextObj);

    return (
        <>
            <Connect/>
            <p>Username:{" "}
            {session?.data?.user?.email !== undefined ? <>{session?.user?.email} (<button onClick={e => signOut()}>Logout</button>)</> : "(none)"}</p>
            {/* <ColonyContext.Provider value={colonyContextObj}> */}
                {children}
            {/* </ColonyContext.Provider> */}
        </>
    );
}