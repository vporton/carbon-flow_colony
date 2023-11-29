'use client'

import Connect from "@/../../main/components/Connect";
import MyMenu from "@/../../main/components/MyMenu";
import { useSession } from "next-auth/react";
import { createContext } from "react";

export default function SubLayout2({ children }: { children: any }) {
    const session = useSession();
    // export const ColonyContext = createContext(colonyContextObj);

    function signOut() {
        // TODO
    }

    return (
        <>
            <Connect/>
            <MyMenu/>
            <p>Username:{" "}
            {session?.data?.user?.email !== undefined ? <>{session?.data?.user?.email} (<button onClick={e => signOut()}>Logout</button>)</> : "(none)"}</p>
            {/* <ColonyContext.Provider value={colonyContextObj}> */}
                {children}
            {/* </ColonyContext.Provider> */}
        </>
    );
}