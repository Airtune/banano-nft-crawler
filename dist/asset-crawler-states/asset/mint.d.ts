import { AssetCrawler } from "../../asset-crawler";
import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";
export declare function assetMintCrawl(_nanoNode: NanoNode, assetCrawler: AssetCrawler, _mintBlock: INanoBlock): Promise<IStatusReturn<boolean>>;
