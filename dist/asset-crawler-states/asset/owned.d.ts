import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { AssetCrawler } from "../../asset-crawler";
export declare function ownedCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean>;
