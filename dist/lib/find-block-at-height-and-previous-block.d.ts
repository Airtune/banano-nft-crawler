import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";
export declare function findBlockAtHeightAndPreviousBlock(nanoNode: NanoNode, account: TAccount, height: bigint): Promise<IStatusReturn<[INanoBlock, INanoBlock] | undefined>>;
