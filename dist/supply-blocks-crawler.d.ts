import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from 'nano-account-crawler/dist/nano-node';
import { TAccount } from "./types/banano";
export declare class SupplyBlocksCrawler {
    private _issuer;
    supplyBlocks: INanoBlock[];
    metadataRepresentatives: TAccount[];
    constructor(issuer: string);
    crawl(nanoNode: NanoNode, maxRpcIterations?: number): Promise<INanoBlock[]>;
    private validateSupplyBlock;
}
