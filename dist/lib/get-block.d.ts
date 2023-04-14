import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";
export declare const getBlock: (nanoNode: NanoNode, account: TAccount, hash: string) => Promise<IStatusReturn<INanoBlock | undefined>>;
