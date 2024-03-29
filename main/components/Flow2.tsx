"use client";

import { ethers } from "ethers";
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import config from "@/../config.json";
import { Button } from "@mui/material";
import { colonyNetwork } from "@/../util/serverSideEthConnect";
import { bufferToEthAddress } from "../../util/eth";
import Carbon from "@porton/carbon-flow/artifacts/contracts/Carbon.sol/Carbon.json";
import { carbonTokenAddress } from "@/../util/data";

export default function Flow2(props: {parentId: number, childId: number | undefined}) {
    const [currentChildId, setCurrentChildId] = useState(props.childId);
    const [kind, setKind] = useState<'simple' | 'recurring'>('simple');
    const [start, setStart] = useState<Date | undefined>(undefined);
    const [credit, setCredit] = useState<ethers.BigNumber>(ethers.utils.parseEther('0'));
    const [remaining, setRemaining] = useState<ethers.BigNumber>(ethers.utils.parseEther('0'));
    const [period, setPeriod] = useState<number>(0);

    const carbon = new ethers.Contract(carbonTokenAddress, Carbon.abi);

    useEffect(() => {
        // TODO: tokenFlow is retrieved by network twice in this component.
        carbon.methods.tokenFlow(currentChildId, props.parentId)
            .then((tokenFlow: any) => {
                const limit = tokenFlow.limit;
                setKind(limit.recurring ? 'recurring' : 'simple');
                setStart(limit.firstTimeEnteredSwapCredit);
                setCredit(limit.initialSwapCredit);
                setRemaining(tokenFlow.remainingSwapCredit);
                setPeriod(limit.swapCreditPeriod);
            });
    }, [carbon.methods, currentChildId, props.parentId]);

    async function submit() {
        const colony = await colonyNetwork.getColony(await bufferToEthAddress(colonyAddress));
        // TODO: Should display transaction popup?

        const tokenFlow = await carbon.methods.tokenFlow(currentChildId, props.parentId);
        const swapLimit = tokenFlow.limit;
        function calculateHash(data: any) {
            return ethers.utils.solidityKeccak256(
                ['bool', 'int256', 'int256', 'int', 'int'],
                [data.recurring, data.initialSwapCredit, data.maxSwapCredit, data.swapCreditPeriod, data.firstTimeEnteredSwapCredit]);
        }
        const oldLimitHash = calculateHash(swapLimit);

        let action: ethers.PopulatedTransaction;
        switch (kind) {
            case 'simple':
                action = await carbon.populateTransaction.setNonRecurringFlow(
                    props.childId, props.parentId, credit, oldLimitHash);
                break;
            case 'recurring':
                action = await carbon.populateTransaction.setRecurringFlow(
                    props.childId, props.parentId, credit, remaining, period, start, oldLimitHash);
                break;
        }
        const serializedAction = ethers.utils.serializeTransaction(action);
        await colony.makeArbitraryTransaction(
            carbonTokenAddress, // TODO
            serializedAction,
        ).metaMotion().send();
    }

    return (
        <>
            {/* TODO: Show token comments. */}
            <p>Parent token: {props.parentId}. Child token:
                {props.childId !== undefined ? props.childId :
                    <input step={1} onChange={e => setCurrentChildId(parseInt((e.target as HTMLInputElement).value))}/>}.</p>
            <p>
                <label><input type="radio" name="kind" value="simple" checked={kind === 'simple'} onClick={() => setKind('simple')}/>
                    {" "}Simple
                </label>
            </p>
            <p>Remaining swap credit for the child:{" "}
                <input type="number" disabled={kind !== 'simple'} defaultValue={ethers.utils.formatEther(credit)}
                    onInput={e => setCredit(ethers.utils.parseEther((e.target as HTMLInputElement).value))}/></p>
            <p><label><input type="radio" name="kind" value="recurring" checked={kind === 'recurring'}/> Recurring</label></p>
            <p>
                Max swap credit per time interval:
                <input type="number" disabled={kind !== 'recurring'} defaultValue={ethers.utils.formatEther(credit)}
                    onInput={e => setCredit(ethers.utils.parseEther((e.target as HTMLInputElement).value))}/>
                Remaining swap credit:
                <input type="number" disabled={kind !== 'recurring'} defaultValue={ethers.utils.formatEther(remaining)}
                    onInput={e => setRemaining(ethers.utils.parseEther((e.target as HTMLInputElement).value))}/>
            </p>
            <p>Per time interval:
                <input type="number" disabled={kind !== 'recurring'} defaultValue={period}
                    onInput={e => setPeriod(parseInt((e.target as HTMLInputElement).value))}/>{" "}
                    sec {/* TODO: <select> to choose timeunit */}
            </p>
            <p>Period start: <label><input type="radio" name="startKind" value="now" checked={start === undefined}/> Now</label></p>
            <p><label><input type="radio" name="startKind" value="date" checked={start !== undefined}/></label>
                <DatePicker selected={start} onChange={(date: Date) => setStart(date)} />
            </p>
            <p><Button onClick={submit}>Submit</Button></p>
        </>
    );
}