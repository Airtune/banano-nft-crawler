import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare function findBlockAtHeightAndPreviousBlock(nanoNode: NanoNode, account: TAccount, height: bigint): Promise<([INanoBlock, INanoBlock] | undefined)>;
