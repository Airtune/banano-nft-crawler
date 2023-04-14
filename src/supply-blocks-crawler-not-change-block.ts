import { INanoBlock, TAccount, TBlockHash, TStringBigInt } from "nano-account-crawler/dist/nano-interfaces";
import { NanoAccountForwardCrawler } from "nano-account-crawler/dist/nano-account-forward-crawler";
import { NanoNode } from 'nano-account-crawler/dist/nano-node';

import { accountDataType } from "./account-data-type";
import { parseSupplyRepresentative } from "./block-parsers/supply";
import {
  MAX_RPC_ITERATIONS,
  META_PROTOCOL_SUPPORTED_VERSIONS,
} from "./constants";

// Crawler to find all supply blocks by an issuer
export class SupplyBlocksCrawlerNotChangeBlock {
  private _head: TBlockHash;
  private _headHeight: number;
  private _issuer: TAccount;
  private _offset: TStringBigInt;
  public ignoreMetadataRepresentatives: TAccount[];
  public supplyBlocks: INanoBlock[];
  public metadataRepresentatives: TAccount[];
  public frontierCheckedBlock: INanoBlock;
  private _errors: Error[] = [];

  constructor(issuer: TAccount, head: TBlockHash = undefined, offset: TStringBigInt = "0") {
    this._issuer = issuer;
    this._head = head;
    this._offset = offset;
    this.ignoreMetadataRepresentatives ||= [];
  }

  async crawl(nanoNode: NanoNode, maxRpcIterations: number = MAX_RPC_ITERATIONS): Promise<INanoBlock[]> {
    // Initialize crawler that crawls forward from account frontier
    const banCrawler = new NanoAccountForwardCrawler(nanoNode, this._issuer, this._head, this._offset);
    banCrawler.maxRpcIterations = maxRpcIterations;

    try {
      await banCrawler.initialize();
    } catch (error) {
      this._errors.push(error);
      return;
    }

    const supplyBlocks: INanoBlock[] = [];
    let frontierCheckedBlock: INanoBlock = undefined;
    const metadataRepresentatives: TAccount[] = [];

    try {
      // Crawl forward from frontier in issuer account
      for await (const followedByBlockStatusReturn of banCrawler) {
        if (followedByBlockStatusReturn.status == "error") {
          this._errors.push(Error(`${followedByBlockStatusReturn.error_type}: ${followedByBlockStatusReturn.message}`));
          return;
        }
        const followedByBlock = followedByBlockStatusReturn.value;
        if (this.validateSupplyBlock(frontierCheckedBlock, followedByBlock, metadataRepresentatives)) {
          supplyBlocks.push(frontierCheckedBlock);
          metadataRepresentatives.push(followedByBlock.representative);
        }

        // Cache followedByBlock that is ahead of block in next iteration
        frontierCheckedBlock = followedByBlock;
        this._head = frontierCheckedBlock.hash;
        this._headHeight = parseInt(frontierCheckedBlock.height);
        if (this.validateSupplyRepresentative(frontierCheckedBlock.representative)) {
          this._offset = "-1";
        } else {
          this._offset = "0";
        }
      }
    } catch(error) {
      this._errors.push(error);
      return;
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
    if (block.subtype === 'change') {
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
    if (accountDataType(followedByBlock.representative) !== "unknown") {
      return false;
    }

    // Supply block cannot reuse metadata representative
    if (metadataRepresentatives.includes(followedByBlock.representative)) {
      return false;
    }
    if (this.ignoreMetadataRepresentatives.includes(followedByBlock.representative)) {
      return false;
    }

    return this.validateSupplyRepresentative(block.representative);
  }

  private validateSupplyRepresentative(representative: TAccount): boolean {
    // Check if representative is a parsable supply_representative with a supported version
    const supplyData = parseSupplyRepresentative(representative);
    if (!supplyData) {
      return false;
    }
    if (!META_PROTOCOL_SUPPORTED_VERSIONS.includes(supplyData.version)) {
      return false;
    }

    return true;
  }

  public get head(): (undefined | TBlockHash) {
    return this._head;
  }

  public get headHeight(): (undefined | number) {
    return this._headHeight;
  }

  public get errors(): Error[] {
    return this._errors;
  }
}
