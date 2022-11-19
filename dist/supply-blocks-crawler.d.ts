import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from 'nano-account-crawler/dist/nano-node';
import { TAccount, TBlockHash } from "./types/banano";
export declare class SupplyBlocksCrawler {
    private _head;
    private _headHeight;
    private _issuer;
    private _offset;
    ignoreMetadataRepresentatives: TAccount[];
    supplyBlocks: INanoBlock[];
    metadataRepresentatives: TAccount[];
    frontierCheckedBlock: INanoBlock;
    constructor(issuer: string, head?: TBlockHash, offset?: string);
    crawl(nanoNode: NanoNode, maxRpcIterations?: number): Promise<INanoBlock[]>;
    private validateSupplyBlock;
    private validateSupplyRepresentative;
    get head(): (undefined | TBlockHash);
    get headHeight(): (undefined | number);
}
