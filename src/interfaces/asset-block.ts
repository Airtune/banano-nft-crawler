import { TAccount, TBlockHash, TBlockHeight, TNanoBlockSubtype, TNanoBlockType, TStringBigInt } from "nano-account-crawler/dist/nano-interfaces";
import { TAssetBlockType } from "../types/asset-block-type";
import { TAssetState } from "../types/asset-state";

export interface IAssetBlock {
  state: TAssetState,
  type: TAssetBlockType,
  account: TAccount, // account of frontier block (eg. receive#atomic_swap account during a swap)
  owner: TAccount, // owner of asset (eg. send#atomic_swap account during a swap)
  locked: boolean, // whether the owner has power over the asset or not at the current block
  traceLength: bigint,
  block_link: TBlockHash,
  block_hash: TBlockHash,
  block_height: TBlockHeight,
  block_account: TAccount,
  block_representative: TAccount,
  block_type: TNanoBlockType,
  block_subtype: TNanoBlockSubtype,
  block_amount: TStringBigInt
}
