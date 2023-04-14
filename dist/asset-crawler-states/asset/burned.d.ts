import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";
import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
export declare function burnedCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<IStatusReturn<boolean>>;
