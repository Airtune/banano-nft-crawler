// src
import { AssetCrawler } from "../../asset-crawler";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

// State for when the the block's account own the asset.
export async function burnedCrawl(nanoNode: NanoNode, assetCrawler: AssetCrawler): Promise<boolean> {
  return false;
}
