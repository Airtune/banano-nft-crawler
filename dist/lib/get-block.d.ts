import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { TAccount } from "../types/banano";
export declare const getBlock: (nanoNode: NanoNode, account: TAccount, hash: string) => Promise<INanoBlock | undefined>;
