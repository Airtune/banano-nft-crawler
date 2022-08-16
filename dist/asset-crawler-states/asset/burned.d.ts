import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare function burnedCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean>;
