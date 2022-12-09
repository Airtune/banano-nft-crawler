import { NanoAccountBackwardCrawler } from "nano-account-crawler/dist/nano-account-backward-crawler";
import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

export async function findBlockAtHeightAndPreviousBlock(nanoNode: NanoNode, account: TAccount, height: bigint): Promise<([INanoBlock, INanoBlock]|undefined)> {
  const previousHeight          = height - BigInt(1)
  let previousBlock: INanoBlock = undefined;
  let block: INanoBlock         = undefined;

  try {
    const nanoBackwardIterable = new NanoAccountBackwardCrawler(nanoNode, account);
    await nanoBackwardIterable.initialize().catch((error) => { throw(error); });

    for await (const _block of nanoBackwardIterable) {
      let _height = BigInt(_block.height);
      if (_height === height) {
        block = _block;
      } else if (_height === previousHeight) {
        previousBlock = _block;
      } else if (_height < previousHeight) {
        break;
      }
    }

    return [previousBlock, block];
  } catch (error) {
    if (error.message.match(/^NanoNodeError:/)) {
      return undefined;
    } else {
      throw(error);
    }
  }
}
