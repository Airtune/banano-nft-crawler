// interfaces
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

// src
import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";


// State for when the the block's account own the asset.
export async function burnedCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<IStatusReturn<boolean>> {
  return { status: "ok", value: false };
}
