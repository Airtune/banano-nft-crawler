import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare function findReceiveBlock(nanoNode: NanoNode, senderAccount: string, sendHash: string, receiverAccount: string): Promise<(INanoBlock | undefined)>;
