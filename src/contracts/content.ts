import { Cell, beginCell, Dictionary } from "@ton/ton";

export function decodeOffChainContent(content: Cell): string {
  let data = content.beginParse();
  let contentType = data.loadUint(8);
  if (contentType !== 0) {
    throw new Error(`Unknown content type: ${contentType}`);
  }

  // Read and convert
  let contentData = data.loadRemainingBytes();
  let str = new TextDecoder().decode(contentData);
  return str;
} 