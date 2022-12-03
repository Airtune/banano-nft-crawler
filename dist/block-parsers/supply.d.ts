import { TAccount } from "nano-account-crawler/dist/nano-interfaces";
export declare function parseSupplyRepresentative(representative: TAccount): {
    version: string;
    maxSupply: bigint;
};
export declare function parseFinishSupplyRepresentative(representative: TAccount): {
    supplyBlockHeight: bigint;
};
