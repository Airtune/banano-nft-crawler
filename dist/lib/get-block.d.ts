import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare const getBlock: (nanoNode: NanoNode, account: TAccount, hash: string) => Promise<INanoBlock | undefined>;
