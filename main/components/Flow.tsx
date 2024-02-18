import Button from "@mui/material/Button";
import { ethers } from "ethers";
import { useState } from "react";
import DatePicker from "react-datepicker"; // TODO: It seems that we use both `react-datepicker` and `react-date-picker`.

export default function Flow(props: {parentId: number, childId: number}) {
    const [kind, setKind] = useState<'simple' | 'recurring'>('simple');
    const [start, setStart] = useState<Date | undefined>(undefined);
    const [credit, setCredit] = useState<ethers.BigNumber>(ethers.utils.parseEther('0'));
    const [remaining, setRemaining] = useState<ethers.BigNumber>(ethers.utils.parseEther('0'));

    async function submit() {
        // TODO
    }

    return (
        <>
            <p>Parent token: {props.parentId}. Child token: {props.childId}.</p> {/* TODO: Show token comments. */}
            <p>
                <label><input type="radio" name="kind" value="simple" checked={kind === 'simple'} onClick={() => setKind('simple')}/>
                    {" "}Simple
                </label>
            </p>
            <p>Remaining swap credit for the child:{" "}
                <input type="number" disabled={kind !== 'simple'} value={ethers.utils.formatEther(credit)}
                    onInput={e => setCredit(ethers.utils.parseEther((e.target as HTMLInputElement).value))}/></p>
            <p><label><input type="radio" name="kind" value="recurring" checked={kind === 'recurring'}/> Recurring</label></p>
            <p>
                Max swap credit per time interval:
                <input type="number" disabled={kind !== 'recurring'} value={ethers.utils.formatEther(credit)}
                    onInput={e => setCredit(ethers.utils.parseEther((e.target as HTMLInputElement).value))}/>
                Remaining swap credit:
                <input type="number" disabled={kind !== 'recurring'} value={ethers.utils.formatEther(remaining)}
                    onInput={e => setRemaining(ethers.utils.parseEther((e.target as HTMLInputElement).value))}/>
            </p>
            <p>Per time interval: <input type="number" disabled={kind !== 'recurring'}/> sec</p> {/* TODO: <select> to choose timeunit */}
            <p>Period start: <label><input type="radio" name="startKind" value="now" checked={start === undefined}/> Now</label></p>
            <p><label><input type="radio" name="startKind" value="date" checked={start !== undefined}/></label>
                <DatePicker selected={start} onChange={(date: Date) => setStart(date)} />
            </p>
            <p><Button onClick={submit}>Submit</Button></p>
        </>
    );
}
