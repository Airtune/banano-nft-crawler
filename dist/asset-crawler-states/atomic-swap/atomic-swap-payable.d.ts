import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare function atomicSwapPayableCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean>;
