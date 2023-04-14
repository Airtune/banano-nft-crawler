import { NanoAccountBackwardCrawler } from "nano-account-crawler/dist/nano-account-backward-crawler";
import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

export async function findBlockAtHeightAndPreviousBlock(nanoNode: NanoNode, account: TAccount, height: bigint): Promise<IStatusReturn<[INanoBlock, INanoBlock]|undefined>> {
  const previousHeight          = height - BigInt(1)
  let previousBlock: INanoBlock = undefined;
  let block: INanoBlock         = undefined;

  try {
    const nanoBackwardIterable = new NanoAccountBackwardCrawler(nanoNode, account);
    const initializeStatusReturn = await nanoBackwardIterable.initialize();
    if (initializeStatusReturn.status === "error") {
      return { status: "error", error_type: "NanoBackwardIterableInitializationError", message: initializeStatusReturn.message };
    }

    for await (const _blockStatusReturn of nanoBackwardIterable) {
      if (_blockStatusReturn.status === "error") {
        return { status: "error", error_type: "NanoBackwardIterableError", message: _blockStatusReturn.message };
      }

      const _block = _blockStatusReturn.value;
      let _height = BigInt(_block.height);
      if (_height === height) {
        block = _block;
      } else if (_height === previousHeight) {
        previousBlock = _block;
      } else if (_height < previousHeight) {
        break;
      }
    }

    return { status: "ok", value: [previousBlock, block] };
  } catch (error) {
    return { status: "error", error_type: "UnexpectedError", message: `${error}` };
  }
}
