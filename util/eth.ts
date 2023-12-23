export function ethHashToBuffer(address: string): Buffer {
  const address2 = address.startsWith('0x') || address.startsWith('0X') ? address.substring(2) : address;
  const byteBuf = Buffer.alloc(address2.length/2);
  for (let i=2; i<address.length; i+=2) {
    byteBuf[i/2] = parseInt(address.slice(i,i+2),16);
    if (isNaN(byteBuf[i/2])) {
      throw new Error("wrong hash");
    }
  }
  return byteBuf;
}

export async function bufferToEthHash(buf: Buffer) {
  let result = "0x"; // TODO
  for (let x of Array.from(buf)) {
      let hex = x.toString(16);
      if (hex.length === 1) {
        hex = "0" + hex;
      }
      result += hex;
  }
  return result;
}

export function ethAddressToBuffer(address: string): Buffer {
  if (address.length !== 42 || (!address.startsWith('0x') && !address.startsWith('0X'))) {
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