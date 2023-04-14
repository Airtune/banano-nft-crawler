import { NanoAccountBackwardCrawler } from "nano-account-crawler/dist/nano-account-backward-crawler";
import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

export async function findReceiveBlock(nanoNode: NanoNode, senderAccount: TAccount, sendHash: string, receiverAccount: TAccount): Promise<IStatusReturn<{receiveBlock: INanoBlock, headBlock: INanoBlock}>> {
  let headBlock;

  try {
    // Variant that filters by senderAccount (!!!)
    //const nanoBackwardIterable = new NanoAccountBackwardCrawler(nanoNode, receiverAccount, undefined, [senderAccount]);
    const nanoBackwardIterable = new NanoAccountBackwardCrawler(nanoNode, receiverAccount, undefined);
    const initializeStatusReturn = await nanoBackwardIterable.initialize();
    if (initializeStatusReturn.status === "error") {
      return initializeStatusReturn;
    }

    for await (const blockStatusReturn of nanoBackwardIterable) {
      if (blockStatusReturn.status === "error") {
        return blockStatusReturn;
      }
      const block = blockStatusReturn.value;
      headBlock = headBlock || block;
      if (block.type === 'state' && block.subtype === 'receive' && block.link === sendHash) {
        return { status: "ok", value: { receiveBlock: block, headBlock: block} };
      }
    }

    return { status: "ok", value: { receiveBlock: undefined, headBlock: headBlock} };
  } catch(error) {
    return { status: "error", error_type: "FindReceiveBlockError", message: error.message };
  }
}
