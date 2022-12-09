import { findReceiveBlock } from "../../lib/find-receive-block";
import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { TAccount } from "nano-account-crawler/dist/nano-interfaces";

export async function receivableCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean> {
  const sendBlockHash = assetCrawler.frontier.block_hash;

  let sender;

  if (assetCrawler.frontier.type === "send#mint") {
    sender = assetCrawler.issuer;
  } else {
    sender = assetCrawler.previousFrontier.owner;
  }

  const recipient = assetCrawler.frontier.owner;
  const { success, block } = await findReceiveBlock(nanoNode, sender, sendBlockHash, recipient).catch((error) => { throw(error); });
  // guards
  if (typeof block === 'undefined') { return false; }
  assetCrawler.traceLength += BigInt(1);
  assetCrawler.head = block.hash;
  assetCrawler.headHeight = parseInt(block.height);
  if (!success) { return false; }

  if (block.subtype === 'receive' && block.link === sendBlockHash) {
    assetCrawler.assetChain.push({
      state: 'owned',
      type: 'receive#asset',
      account: recipient,
      owner: recipient,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: block.link,
      block_hash: block.hash,
      block_height: block.height,
      block_account: block.account,
      block_representative: block.representative,
      block_type: block.type,
      block_subtype: block.subtype,
      block_amount: block.amount
    });

    return true;
  }

  return false;
}
