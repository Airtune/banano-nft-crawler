// interfaces
import { IAssetBlock } from "../interfaces/asset-block";

// src
import { AssetCrawler } from "../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

export async function returnToNFTSellerCrawl(_nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<IStatusReturn<boolean>> {
  const assetChain: IAssetBlock[] = assetCrawler.assetChain;

  const sendAtomicSwapBlockStatusReturn = _findSenderBlock(assetChain);
  if (sendAtomicSwapBlockStatusReturn.status === "error") {
    return sendAtomicSwapBlockStatusReturn;
  }
  const sendAtomicSwapBlock = sendAtomicSwapBlockStatusReturn.value;
  let frontier: IAssetBlock = {
    state: "owned",
    type: "send#returned_to_sender",
    account: sendAtomicSwapBlock.account,
    owner: sendAtomicSwapBlock.account,
    locked: false,
    traceLength: assetCrawler.traceLength,
    block_link:           sendAtomicSwapBlock.block_link,
    block_hash:           sendAtomicSwapBlock.block_hash,
    block_height:         sendAtomicSwapBlock.block_height,
    block_account:        sendAtomicSwapBlock.block_account,
    block_representative: sendAtomicSwapBlock.block_representative,
    block_type:           sendAtomicSwapBlock.block_type,
    block_subtype:        sendAtomicSwapBlock.block_subtype,
    block_amount:         sendAtomicSwapBlock.block_amount
  };

  assetCrawler.assetChain.push(frontier);

  assetCrawler.head = sendAtomicSwapBlock.block_hash;
  assetCrawler.headHeight = parseInt(sendAtomicSwapBlock.block_height);
  
  return { status: "ok", value: true };
}

function _findSenderBlock(assetChain: IAssetBlock[]): IStatusReturn<IAssetBlock> {
  for (let i = assetChain.length - 1; i >= 0; i--) {
    const block: IAssetBlock = assetChain[i];
    if (["atomic_swap_receivable"].includes(block.state)) {
      return { status: "ok", value: block };
    }
  }

  return {
    status: "error",
    error_type: "UnableToFindBlock",
    message: `Unable to find atomic_swap_receivable for asset: ${assetChain[0].block_hash}`
  }
}
