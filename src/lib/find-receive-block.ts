import { NanoAccountBackwardCrawler } from "nano-account-crawler/dist/nano-account-backward-crawler";
import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

export async function findReceiveBlock(nanoNode: NanoNode, senderAccount: string, sendHash: string, receiverAccount: string): Promise<(INanoBlock|undefined)> {
  try {
    const nanoBackwardIterable = new NanoAccountBackwardCrawler(nanoNode, receiverAccount, undefined, [senderAccount]);
    await nanoBackwardIterable.initialize();

    for await (const block of nanoBackwardIterable) {
      if (block.type === 'state' && block.subtype === 'receive' && block.link === sendHash) {
        return block;
      }
    }

    return undefined;
  } catch(error) {
    throw(error);
  }
}
