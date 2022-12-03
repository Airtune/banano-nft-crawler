// interfaces
import { IAssetBlock } from "../interfaces/asset-block";

// src
import { AssetCrawler } from "../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

export async function returnToNFTSellerCrawl(_nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean> {
  const assetChain: IAssetBlock[] = assetCrawler.assetChain;

  const sendAtomicSwapBlock = _findSenderBlock(assetChain);
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
  
  return true;
}

function _findSenderBlock(assetChain: IAssetBlock[]): IAssetBlock {
  for (let i = assetChain.length - 1; i >= 0; i--) {
    const block: IAssetBlock = assetChain[i];
    if (["atomic_swap_receivable"].includes(block.state)) {
      return block;
    }
  }

  throw Error(`Unabled to find atomic_swap_receivable for asset: ${assetChain[0].block_hash}`);;
}
