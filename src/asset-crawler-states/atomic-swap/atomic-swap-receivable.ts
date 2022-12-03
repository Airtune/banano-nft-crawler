import { AssetCrawler } from "../../asset-crawler";
import { IAtomicSwapConditions } from "../../interfaces/atomic-swap-conditions";
import { parseAtomicSwapRepresentative } from "../../block-parsers/atomic-swap";
import { findBlockAtHeightAndPreviousBlock } from "../../lib/find-block-at-height-and-previous-block";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { TAccount } from "nano-account-crawler/dist/nano-interfaces";

// State for when send#atomic_swap is confirmed and receive#atomic_swap is ready to be received but hasn't been confirmed yet.
export async function atomicSwapReceivableCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean> {
  const sendAtomicSwap = assetCrawler.frontier;
  const sendAtomicSwapHash = sendAtomicSwap.block_hash;
  const representative = sendAtomicSwap.block_representative;
  const atomicSwapConditions: IAtomicSwapConditions = parseAtomicSwapRepresentative(representative);
  // guard
  if (typeof atomicSwapConditions === 'undefined') {
    throw Error(`AtomicSwapError: Unable to parse conditions for representative: ${sendAtomicSwap.block_representative}`);
  }

  // guard check if paying account doesn't have enough raw.
  const payerAccount = sendAtomicSwap.account;
  const originalOwner = sendAtomicSwap.owner;

  // NB: Trace length from findBlockAtHeight might be significantly larger than 1.
  assetCrawler.traceLength += BigInt(1);
  const blocks = await findBlockAtHeightAndPreviousBlock(nanoNode, payerAccount, atomicSwapConditions.receiveHeight);
  const [previousBlock, receiveBlock] = blocks;

  if (previousBlock === undefined) { return false; }
  if (BigInt(previousBlock.balance) < atomicSwapConditions.minRaw) {
    assetCrawler.assetChain.push({
      state: "owned",
      type: "send#returned_to_sender",
      account: originalOwner,
      owner: originalOwner,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: sendAtomicSwap.block_link,
      block_hash: sendAtomicSwap.block_hash,
      block_height: sendAtomicSwap.block_height,
      block_account: sendAtomicSwap.block_account,
      block_representative: sendAtomicSwap.block_representative,
      block_type: sendAtomicSwap.block_type,
      block_subtype: sendAtomicSwap.block_subtype,
      block_amount: sendAtomicSwap.block_amount
    });

    return true;
  }
  
  // guard
  if (receiveBlock === undefined) { return false; }

  const isReceive = receiveBlock.subtype === 'receive'
  const receivesAtomicSwap = receiveBlock.link === sendAtomicSwapHash;
  const hasCorrectHeight = BigInt(receiveBlock.height) === atomicSwapConditions.receiveHeight;
  const representativeUnchanged = receiveBlock.representative == previousBlock.representative;

  if (isReceive && receivesAtomicSwap && hasCorrectHeight && representativeUnchanged) {
    assetCrawler.assetChain.push({
      state: "atomic_swap_payable",
      type: "receive#atomic_swap",
      account: payerAccount,
      owner: originalOwner,
      locked: true,
      traceLength: assetCrawler.traceLength,
      block_link: receiveBlock.link,
      block_hash: receiveBlock.hash,
      block_height: receiveBlock.height,
      block_account: receiveBlock.account,
      block_representative: receiveBlock.representative,
      block_type: receiveBlock.type,
      block_subtype: receiveBlock.subtype,
      block_amount: receiveBlock.amount
    });

    assetCrawler.head = receiveBlock.hash;
    assetCrawler.headHeight = parseInt(receiveBlock.height);
  } else {
    // Atomic swap conditions were not met. Start chain from send#atomic_swap with new state.
    assetCrawler.assetChain.push({
      state: "(return_to_nft_seller)",
      type: "receive#abort_receive_atomic_swap",
      account: originalOwner,
      owner: originalOwner,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: receiveBlock.link,
      block_hash: receiveBlock.hash,
      block_height: receiveBlock.height,
      block_account: receiveBlock.account,
      block_representative: receiveBlock.representative,
      block_type: receiveBlock.type,
      block_subtype: receiveBlock.subtype,
      block_amount: receiveBlock.amount
    });
    assetCrawler.assetChain.push({
      state: 'owned',
      type: 'send#returned_to_sender',
      account: originalOwner,
      owner: originalOwner,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: sendAtomicSwap.block_link,
      block_hash: sendAtomicSwap.block_hash,
      block_height: sendAtomicSwap.block_height,
      block_account: sendAtomicSwap.block_account,
      block_representative: sendAtomicSwap.block_representative,
      block_type: sendAtomicSwap.block_type,
      block_subtype: sendAtomicSwap.block_subtype,
      block_amount: sendAtomicSwap.block_amount
    });

    assetCrawler.head = sendAtomicSwap.block_hash;
    assetCrawler.headHeight = parseInt(sendAtomicSwap.block_height);
  }

  return true;
}
