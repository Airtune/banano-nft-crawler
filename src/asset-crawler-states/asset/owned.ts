// dependencies
import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoAccountForwardCrawler } from "nano-account-crawler/dist/nano-account-forward-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

// interfaces
import { IAssetBlock } from "../../interfaces/asset-block";
import { IAtomicSwapConditions } from "../../interfaces/atomic-swap-conditions";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

// types
import { TAssetState } from "../../types/asset-state";
import { TAssetBlockType } from "../../types/asset-block-type";

// constants
import { BURN_ACCOUNTS, SEND_ALL_NFTS_REPRESENTATIVE } from "../../constants";

// src
import { AssetCrawler } from "../../asset-crawler";
import { parseAtomicSwapRepresentative } from "../../block-parsers/atomic-swap";

// State for when the the block's account own the asset.
export async function ownedCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<IStatusReturn<boolean>> {
  // trace forward in account history from frontier block
  let frontierCrawler = new NanoAccountForwardCrawler(nanoNode, assetCrawler.frontier.owner, assetCrawler.frontier.block_hash, "1");

  try {
    const initializeStatusReturn = await frontierCrawler.initialize();
    if (initializeStatusReturn.status === 'error') {
      console.log(`Unable to initialize frontierCrawler in owned.ts: ${initializeStatusReturn.message}`);
      return { status: "ok", value: false };
    }

    for await (const nanoBlockStatusReturn of frontierCrawler) {
      if (nanoBlockStatusReturn.status === 'error') {
        console.log(`Error occurred while crawling forward: ${nanoBlockStatusReturn.message}`);
        return { status: "ok", value: false };
      }
      const nanoBlock = nanoBlockStatusReturn.value;

      assetCrawler.traceLength += BigInt(1);
      assetCrawler.head = nanoBlock.hash;
      assetCrawler.headHeight = parseInt(nanoBlock.height);

      const assetBlock: IAssetBlock = toAssetBlock(assetCrawler, nanoBlock);
      if (assetBlock === undefined) { continue; }

      assetCrawler.assetChain.push(assetBlock);
      return { status: "ok", value: true };
    }
  } catch(error) {
    return {
      status: "error",
      error_type: "UnexpectedError",
      message: `${error}`
    }
  }

  return { status: "ok", value: false };
}


function toAssetBlock(assetCrawler: AssetCrawler, block: INanoBlock): (IAssetBlock|undefined) {
  if (block.type !== 'state') { return undefined; }

  if (block.subtype === 'send') {
    if (block.representative === assetCrawler.assetRepresentative || block.representative === SEND_ALL_NFTS_REPRESENTATIVE) {
      const recipient = block.account;
      let state: TAssetState;
      let type: TAssetBlockType;
      if (BURN_ACCOUNTS.includes(recipient)) {
        state = "burned";
        type = "send#burn";
      } else {
        state = "receivable";
        type = "send#asset";
      }

      return {
        state: state,
        type: type,
        account: recipient,
        owner: recipient,
        locked: false,
        traceLength: assetCrawler.traceLength,
        block_link:           block.link,
        block_hash:           block.hash,
        block_height:         block.height,
        block_account:        block.account,
        block_representative: block.representative,
        block_type:           block.type,
        block_subtype:        block.subtype,
        block_amount:         block.amount
      };
    }

    const ownerAccount   = assetCrawler.frontier.owner;
    const payingAccount  = block.account;
    const representative = block.representative;
    const atomicSwapConditions: IAtomicSwapConditions = parseAtomicSwapRepresentative(representative);
    const ownershipBlockHeight = BigInt(assetCrawler.frontier.block_height);
    const attemptTradeWithSelf = payingAccount == ownerAccount;
    const validReceiveHeight   = atomicSwapConditions && atomicSwapConditions.receiveHeight >= BigInt(2);
    const currentAssetHeight   = atomicSwapConditions && atomicSwapConditions.assetHeight === ownershipBlockHeight;
    const sends1raw            = atomicSwapConditions && BigInt(block.amount) == BigInt('1');
    if (!attemptTradeWithSelf && validReceiveHeight && currentAssetHeight && sends1raw) {
      const payingAccount = block.account;
      return {
        state: 'atomic_swap_receivable',
        type: 'send#atomic_swap',
        account: payingAccount,
        owner: ownerAccount,
        locked: true,
        traceLength: assetCrawler.traceLength,
        block_link: block.link,
        block_hash: block.hash,
        block_height: block.height,
        block_account: block.account,
        block_representative: block.representative,
        block_type: block.type,
        block_subtype: block.subtype,
        block_amount: block.amount
      };
    }
  }

  return undefined;
}
