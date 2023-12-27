'use client'

import Connect from "@/../main/components/Connect";
import MyMenu from "@/../main/components/MyMenu";
import EthExecuting from "@/components/EthExecuting";
import { useSession } from "next-auth/react";
import { createContext, useRef } from "react";

export const EthTxsContext = createContext<{client: EthExecuting | null}>({client: null});

export default function SubLayout2({ children }: { children: any }) {
    const session = useSession();
    // export const ColonyContext = createContext(colonyContextObj);

    function signOut() {
        // TODO
    }

    const showTxsRef = useRef<EthExecuting>(null);

    return (
        <>
            <EthTxsContext.Provider value={{client: showTxsRef.current}}>
                <EthExecuting ref={showTxsRef}/>
                <Connect/>
                <MyMenu/>
                <p>Username:{" "}
                {session?.data?.user?.email !== undefined ? <>{session?.data?.user?.email} (<button onClick={e => signOut()}>Logout</button>)</> : "(none)"}</p>
                {/* <ColonyContext.Provider value={colonyContextObj}> */}
                    {children}
                {/* </ColonyContext.Provider> */}
            </EthTxsContext.Provider>
        </>
    );
}