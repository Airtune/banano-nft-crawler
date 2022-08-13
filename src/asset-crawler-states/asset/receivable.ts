import { findReceiveBlock } from "../../lib/find-receive-block";
import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

export async function receivableCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean> {
  const sendBlockHash = assetCrawler.frontier.nanoBlock.hash;

  let sender;

  if (assetCrawler.frontier.type === "send#mint") {
    sender = assetCrawler.issuer;
  } else {
    sender = assetCrawler.previousFrontier.owner;
  }

  const recipient = assetCrawler.frontier.owner;
  const receiveBlock = await findReceiveBlock(nanoNode, sender, sendBlockHash, recipient);
  // guards
  if (typeof receiveBlock === 'undefined') { return false; }

  assetCrawler.traceLength += BigInt(1);

  if (receiveBlock.subtype === 'receive' && receiveBlock.link === sendBlockHash) {
    assetCrawler.assetChain.push({
      state: 'owned',
      type: 'receive#asset',
      account: recipient,
      owner: recipient,
      locked: false,
      nanoBlock: receiveBlock,
      traceLength: assetCrawler.traceLength
    });
    return true;
  }

  return false;
}
