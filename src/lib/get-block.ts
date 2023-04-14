import { INanoAccountHistory, INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

export const getBlock = async (nanoNode: NanoNode, account: TAccount, hash: string): Promise<IStatusReturn<INanoBlock|undefined>> => {
  try {
    // "block_info" RPC returns different data format than "account_history" RPC so even though it's info for a single block, in some cases the "account_history" RPC is favored with count set to 1.
    const accountHistoryStatusReturn: IStatusReturn<INanoAccountHistory> = await nanoNode.getBackwardHistory(account, hash, undefined, undefined, 1);

    if (accountHistoryStatusReturn.status === "error") {
      return accountHistoryStatusReturn;
    }

    const accountHistory: INanoAccountHistory = accountHistoryStatusReturn.value;
    const block: INanoBlock = accountHistory.history[0];

    return { status: "ok", value: block };
  } catch(error) {
    return { status: "error", error_type: "UnexpectedError", message: error.message };
  }
};
