import { TAccount, TBlockHash } from "nano-account-crawler/dist/nano-interfaces";

export interface IMintBlock {
  type: string, subtype: string, representative: TAccount, hash: TBlockHash
}
