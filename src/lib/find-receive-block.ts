import { NanoAccountBackwardCrawler } from "nano-account-crawler/dist/nano-account-backward-crawler";
import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

export async function findReceiveBlock(nanoNode: NanoNode, senderAccount: TAccount, sendHash: string, receiverAccount: TAccount): Promise<({success: boolean, block: INanoBlock|undefined})> {
  try {
    // Variant that filters by senderAccount (!!!)
    //const nanoBackwardIterable = new NanoAccountBackwardCrawler(nanoNode, receiverAccount, undefined, [senderAccount]);
    const nanoBackwardIterable = new NanoAccountBackwardCrawler(nanoNode, receiverAccount, undefined);
    await nanoBackwardIterable.initialize();

    let headBlock;

    for await (const block of nanoBackwardIterable) {
      headBlock = headBlock || block;
      if (block.type === 'state' && block.subtype === 'receive' && block.link === sendHash) {
        return { success: true, block: block };
      }
    }

    return { success: false, block: headBlock };
  } catch(error) {
    throw(error);
  }
}
