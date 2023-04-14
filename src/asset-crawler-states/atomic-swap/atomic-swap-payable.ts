import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { IAtomicSwapConditions } from "../../interfaces/atomic-swap-conditions";
import { TAssetBlockType } from "../../types/asset-block-type";

import { AssetCrawler } from "../../asset-crawler";
import { parseAtomicSwapRepresentative } from "../../block-parsers/atomic-swap";
import { findBlockAtHeightAndPreviousBlock } from "../../lib/find-block-at-height-and-previous-block";
import { IAssetBlock } from "../../interfaces/asset-block";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

function validPayment(previousBlock: INanoBlock, nextBlock: INanoBlock, sendAtomicSwap: IAssetBlock, atomicSwapConditions: IAtomicSwapConditions) {
  if (nextBlock.subtype !== 'send') {
    return false;
  }

  const payedEnough = BigInt(nextBlock.amount) >= atomicSwapConditions.minRaw;
  const payedCorrectAccount = nextBlock.account === sendAtomicSwap.owner;
  const representativeUnchanged = nextBlock.representative === previousBlock.representative;

  return payedEnough && payedCorrectAccount && representativeUnchanged;
}

// State for when receive#atomic_swap is confirmed but send#payment hasn't been sent yet.
export async function atomicSwapPayableCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<IStatusReturn<boolean>> {
  const payingAccount = assetCrawler.frontier.account;
  const paymentHeight = BigInt(assetCrawler.frontier.block_height) + BigInt(1);
  const prevAndNextBlockStatusReturn = await findBlockAtHeightAndPreviousBlock(nanoNode, payingAccount, paymentHeight).catch((error) => { throw(error) });
  // guard
  if (prevAndNextBlockStatusReturn.status === "error") {
    return prevAndNextBlockStatusReturn;
  }
  const prevAndNextBlock = prevAndNextBlockStatusReturn.value;
  const [previousBlock, nextBlock] = prevAndNextBlock;
  // Guard. Should not happen since this point shouldn't be reached for unopened accounts given
  // the users followed client protocol and checked that the account was opened before initiating a swap.
  if (prevAndNextBlock == undefined) {
    return { status: "error", error_type: 'UnexpectedMetaChain', message: 'Account was not opened before initiating a swap.' };
  }
  const sendAtomicSwap: IAssetBlock = assetCrawler.findSendAtomicSwapBlock();
  // guards
  if (nextBlock === undefined || sendAtomicSwap === undefined) {
    return { status: "error", error_type: 'UnexpectedMetaChain', message: 'nextBlock or sendAtomicSwap is undefined.' };
  }
  if (sendAtomicSwap.state !== 'atomic_swap_receivable') {
    return { status: "error", error_type: 'UnexpectedMetaChain', message: `Expected states of the chain to be pending_atomic_swap -> pending_payment -> ... Got: ${sendAtomicSwap.state} -> ${assetCrawler.frontier.state} -> ...` };
  }
  // NB: Trace length from findBlockAtHeight might be significantly larger than 1.
  assetCrawler.traceLength += BigInt("1");

  const atomicSwapConditions: IAtomicSwapConditions = assetCrawler.currentAtomicSwapConditions();

  const originalOwner = sendAtomicSwap.owner;
  
  if (validPayment(previousBlock, nextBlock, sendAtomicSwap, atomicSwapConditions)) {
    assetCrawler.assetChain.push({
      state: 'owned',
      type: 'send#payment',
      account: payingAccount,
      owner: payingAccount,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: nextBlock.link,
      block_hash: nextBlock.hash,
      block_height: nextBlock.height,
      block_account: nextBlock.account,
      block_representative: nextBlock.representative,
      block_type: nextBlock.type,
      block_subtype: nextBlock.subtype,
      block_amount: nextBlock.amount
    });
    assetCrawler.head = nextBlock.hash;
    assetCrawler.headHeight = parseInt(nextBlock.height);
  } else {
    // Atomic swap conditions were not met.
    // Continue chain from send#atomic_swap again with state 'owned' instead of state 'pending_atomic_swap'.
    let type: TAssetBlockType;
    switch (nextBlock.subtype) {
      case "send":
      case "receive":
      case "change":
        type = `${nextBlock.subtype}#abort_payment`;
        break;
    
      default:
        return { status: "error", error_type: 'UnexpectedBlockSubtype', message: `Pending atomic swap got unexpected block subtype: ${nextBlock.subtype} with block hash: ${nextBlock.hash}` };
    }
    assetCrawler.assetChain.push({
      state: "(return_to_nft_seller)",
      type: type,
      account: originalOwner,
      owner: originalOwner,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: nextBlock.link,
      block_hash: nextBlock.hash,
      block_height: nextBlock.height,
      block_account: nextBlock.account,
      block_representative: nextBlock.representative,
      block_type: nextBlock.type,
      block_subtype: nextBlock.subtype,
      block_amount: nextBlock.amount
    });
    assetCrawler.assetChain.push({
      state: "owned",
      type: "send#returned_to_sender", // essentially ignored because state on the line above is owned
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

  return { status: "ok", value: true };
}
