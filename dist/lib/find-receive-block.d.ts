import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";
export declare function findReceiveBlock(nanoNode: NanoNode, senderAccount: TAccount, sendHash: string, receiverAccount: TAccount): Promise<IStatusReturn<{
    receiveBlock: INanoBlock;
    headBlock: INanoBlock;
}>>;
