import { TAccount, TBlockHash, TPublicKey } from "../types/banano";
const bananojs = require("@bananocoin/bananojs");

export const getBananoAccountPublicKey = (account: TAccount): TPublicKey => {
  return bananojs.getAccountPublicKey(account) as TPublicKey;
}
