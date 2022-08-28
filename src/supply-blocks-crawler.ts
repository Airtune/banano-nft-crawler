import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { NanoAccountForwardCrawler } from "nano-account-crawler/dist/nano-account-forward-crawler";
import { NanoNode } from 'nano-account-crawler/dist/nano-node';

import { accountDataType } from "./account-data-type";
import { parseSupplyRepresentative } from "./block-parsers/supply";
import {
  MAX_RPC_ITERATIONS,
  META_PROTOCOL_SUPPORTED_VERSIONS,
} from "./constants";
import { TAccount, TBlockHash } from "./types/banano";

// Crawler to find all supply blocks by an issuer
export class SupplyBlocksCrawler {
  private _issuer: string;
  private _head: TBlockHash;
  private _offset: string;
  public ignoreMetadataRepresentatives: TAccount[];
  public supplyBlocks: INanoBlock[];
  public metadataRepresentatives: TAccount[];
  public frontierCheckedBlock: INanoBlock;

  constructor(issuer: string, head: TBlockHash = undefined, offset: string = "0") {
    this._issuer = issuer;
    this._head = head;
    this._offset = offset;
    this.ignoreMetadataRepresentatives ||= [];
  }

  async crawl(nanoNode: NanoNode, maxRpcIterations: number = MAX_RPC_ITERATIONS): Promise<INanoBlock[]> {
    // Initialize crawler that crawls forward from account frontier
    const banCrawler = new NanoAccountForwardCrawler(nanoNode, this._issuer, this._head, this._offset);
    await banCrawler.initialize();
    banCrawler.maxRpcIterations = maxRpcIterations;

    const supplyBlocks: INanoBlock[] = [];
    let frontierCheckedBlock: INanoBlock = undefined;
    const metadataRepresentatives: TAccount[] = [];

    // Crawl forward from frontier in issuer account
    for await (const followedByBlock of banCrawler) {
      if (this.validateSupplyBlock(frontierCheckedBlock, followedByBlock, metadataRepresentatives)) {
        supplyBlocks.push(frontierCheckedBlock);
        metadataRepresentatives.push(followedByBlock.representative as TAccount);
      }

      // Cache followedByBlock that is ahead of block in next iteration
      frontierCheckedBlock = followedByBlock;
      this._head = frontierCheckedBlock.hash;
      this._offset = "1";
    }

    this.supplyBlocks = supplyBlocks;
    this.metadataRepresentatives = metadataRepresentatives;

    return supplyBlocks;
  }

  // https://github.com/Airtune/73-meta-tokens/blob/main/meta_ledger_protocol/supply_block.md#validation
  private validateSupplyBlock(block: INanoBlock, followedByBlock: INanoBlock, metadataRepresentatives: TAccount[]): boolean {  
    if (block === undefined) {
      return false;
    }
    // Only change blocks can serve as change#supply blocks.  
    if (block.subtype !== 'change') {
      return false;
    }
    
    // Must be followed by a mint block, i.e., any block that changes representative without matching an established representative header.
    if (followedByBlock === undefined) {
      return false;
    }
    if (block.representative === followedByBlock.representative) {
      return false;
    }

    // Mint block representative must not be special accounts or contain a data encoding header.
    if (accountDataType(followedByBlock.representative as TAccount) !== "unknown") {
      return false;
    }

    // Supply block cannot reuse metadata representative
    if (metadataRepresentatives.includes(followedByBlock.representative as TAccount)) {
      return false;
    }
    if (this.ignoreMetadataRepresentatives.includes(followedByBlock.representative as TAccount)) {
      return false;
    }

    // Check if representative is a parsable supply_representative with a supported version
    const supplyData = parseSupplyRepresentative(block.representative as TAccount);
    if (!supplyData) {
      return false;
    }
    if (!META_PROTOCOL_SUPPORTED_VERSIONS.includes(supplyData.version)) {
      return false;
    }

    return true;
  }
}
