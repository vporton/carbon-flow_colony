"use client";

import React, { forwardRef } from "react";
import { useRef, useState } from "react";

export default class EthExecuting extends React.Component<
    {},
    { txs: { txHash: string; message: string; }[], ref?: React.RefObject<EthExecuting> }
> {
    client = new StoreTxsClient();

    constructor(props: {}) {
        super(props)
        this.state = {
            txs: [],
        };
        this.client.addCallback((txs: {txHash: string, message: string}[]) => this.setState({txs}));
    }

    addTx(txHash: string, message: string) {
        this.client.add(txHash, message);
    }

    render() {
        return (
            <ul>
                {this.state.txs.map(t => {
                    return <li key={t.txHash}><small>{t.txHash}</small> {t.message}</li>
                })}
            </ul>
        );
    }
}

class StoreTxs {
    txs: {txHash: string, message: string}[] = [];
    // const txsMsgs: { [txHash: string]: {message: string} } = {};

    // TODO: Do we need to remove callbacks, when finished?
    callbacks: ((txs: {txHash: string, message: string}[]) => void)[] = [];

    addCallback(callback: ((txs: {txHash: string, message: string}[]) => void)) {
        this.callbacks.push(callback);
    }

    private callCallbacks() {
        for (const c of this.callbacks) {
            c(this.txs);
        }
    }

    add(txHash: string, message: string) {
        this.txs.push({txHash, message});
        this.callCallbacks();
    }

    remove(txHash: string) {
        // Not very efficient, but OK.
        const index = this.txs.findIndex((tx: {txHash: string, message: string}) => tx.txHash === txHash);
        this.txs.splice(index, 1); // remove
        this.callCallbacks();
    }
}

class StoreTxsClient extends StoreTxs {
    addWebSocket(ws: WebSocket) {
        ws.onmessage = (msg) => {
            this.remove(msg.data);
        };
    }
}

