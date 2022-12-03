import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare function findReceiveBlock(nanoNode: NanoNode, senderAccount: TAccount, sendHash: string, receiverAccount: TAccount): Promise<({
    success: boolean;
    block: INanoBlock | undefined;
})>;
