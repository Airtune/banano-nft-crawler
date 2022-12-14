import { INanoAccountHistory, INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

export const getBlock = async (nanoNode: NanoNode, account: TAccount, hash: string): Promise<INanoBlock|undefined> => {
  try {
    // "block_info" RPC returns different data format than "account_history" RPC so even though
    // it's info for a single block, in some cases the "account_history" RPC is favored with count set to 1.
    const accountHistory: INanoAccountHistory = await nanoNode.getBackwardHistory(account, hash, undefined, undefined, 1);
    const block: INanoBlock = accountHistory.history[0];

    return block;
  } catch(error) {
    if (error.message.match(/^NanoNodeError:/)) {
      return undefined;
    } else {
      throw error;
    }
  }
};
