import { TAccount, TBlockHash, TBlockHeight, TNanoBlockSubtype, TNanoBlockType, TStringBigInt } from "nano-account-crawler/dist/nano-interfaces";
import { TAssetBlockType } from "../types/asset-block-type";
import { TAssetState } from "../types/asset-state";
export interface IAssetBlock {
    state: TAssetState;
    type: TAssetBlockType;
    account: TAccount;
    owner: TAccount;
    locked: boolean;
    traceLength: bigint;
    block_link: TBlockHash;
    block_hash: TBlockHash;
    block_height: TBlockHeight;
    block_account: TAccount;
    block_representative: TAccount;
    block_type: TNanoBlockType;
    block_subtype: TNanoBlockSubtype;
    block_amount: TStringBigInt;
}
