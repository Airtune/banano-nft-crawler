import { findReceiveBlock } from "../../lib/find-receive-block";
import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

export async function receivableCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<IStatusReturn<boolean>> {
  const sendBlockHash = assetCrawler.frontier.block_hash;

  let sender;

  if (assetCrawler.frontier.type === "send#mint") {
    sender = assetCrawler.issuer;
  } else {
    sender = assetCrawler.previousFrontier.owner;
  }

  const recipient = assetCrawler.frontier.owner;
  let receiveBlock, headBlock;
  try {
    const receiveBlockSearchResult = await findReceiveBlock(nanoNode, sender, sendBlockHash, recipient);
    if (receiveBlockSearchResult.status === "ok") {
      receiveBlock = receiveBlockSearchResult.value.receiveBlock;
      headBlock = receiveBlockSearchResult.value.headBlock;
    } else {
      return receiveBlockSearchResult;
    }
  } catch(error) {
    return { status: "error", error_type: "UnexpectedError", message: error.message };
  }
  
  // guards
  if (typeof headBlock === 'undefined') { return { status: "ok", value: false }; }
  assetCrawler.traceLength += BigInt(1);
  assetCrawler.head = headBlock.hash;
  assetCrawler.headHeight = parseInt(headBlock.height);
  if (!receiveBlock) { return { status: "ok", value: false }; }

  if (receiveBlock.subtype === 'receive' && receiveBlock.link === sendBlockHash) {
    assetCrawler.assetChain.push({
      state: 'owned',
      type: 'receive#asset',
      account: recipient,
      owner: recipient,
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

    return { status: "ok", value: true };
  }

  return { status: "ok", value: false };
}
