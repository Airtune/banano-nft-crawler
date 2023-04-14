import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";
export declare function atomicSwapPayableCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<IStatusReturn<boolean>>;
