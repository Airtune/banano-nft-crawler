import { AssetCrawler } from "../../asset-crawler";
import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare function assetMintCrawl(_nanoNode: NanoNode, assetCrawler: AssetCrawler, _mintBlock: INanoBlock): Promise<boolean>;
