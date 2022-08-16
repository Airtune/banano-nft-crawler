import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from 'nano-account-crawler/dist/nano-node';
export declare class MintBlocksCrawler {
    private _hasLimitedSupply;
    private _ipfsCID;
    private _issuer;
    private _nftSupplyBlock;
    private _nftSupplyBlockHash;
    private _maxSupply;
    private _metadataRepresentative;
    private _mintBlocks;
    private _version;
    constructor(issuer: string, nftSupplyBlockHash: string);
    crawl(nanoNode: NanoNode, maxRpcIterations?: number): Promise<void>;
    get nftSupplyBlock(): INanoBlock;
    get mintBlocks(): INanoBlock[];
    get ipfsCID(): string;
    get version(): string;
    get maxSupply(): bigint;
    get hasLimitedSupply(): boolean;
    private parseSupplyBlock;
    private parseFinishSupplyBlock;
    private parseFirstMint;
    private supplyExceeded;
}
