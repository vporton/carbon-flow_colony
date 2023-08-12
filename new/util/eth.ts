export function ethAddressToBuffer(address: string): Buffer {
    if (address.length !== 42 || (!address.startsWith('0x') && !address.startsWith('0x'))) {
        throw new Error("wrong Ethereum address");
    }
    const byteBuf = Buffer.alloc(20);
    for (let i=2; i<address.length; i+=2) {
      byteBuf[i/2] = parseInt(address.slice(i,i+2),16);
      if (isNaN(byteBuf[i/2])) {
        throw new Error("wrong Ethereum address");
      }
    }
    return byteBuf;
}

export async function bufferToEthAddress(buf: Buffer) {
    if (buf.length !== 20) {
        throw new Error("wrong Ethereum address");
    }
    let result = "0x";
    for (let x of buf) {
        let hex = x.toString(16);
        if (hex.length === 1) {
          hex = "0" + hex;
        }
        result += hex;
    }
    // TODO: Create mixed-case ETH address
    return result;
}