import { TAccount, TPublicKey } from "nano-account-crawler/dist/nano-interfaces";

const bananojs = require("@bananocoin/bananojs");

export const getBananoAccountPublicKey = (account: TAccount): TPublicKey => {
  return bananojs.getAccountPublicKey(account) as TPublicKey;
}
