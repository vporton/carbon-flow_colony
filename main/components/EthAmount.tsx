import { formatEther, parseEther } from "viem";

export default function EthAmount(props: {value?: bigint, onChange?: (v: bigint) => void}) {
    return <input
        type="number"
        value={props.value !== undefined ? formatEther(props.value) : ""}
        onChange={e => props.onChange && props.onChange(parseEther(e.target.value))}
    />
}