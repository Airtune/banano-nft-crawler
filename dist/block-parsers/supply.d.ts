import { TAccount } from "../types/banano";
export declare function parseSupplyRepresentative(representative: TAccount): {
    version: string;
    maxSupply: bigint;
};
export declare function parseFinishSupplyRepresentative(representative: TAccount): {
    supplyBlockHeight: bigint;
};
