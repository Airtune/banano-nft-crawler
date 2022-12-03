import { INanoBlock, TAccount, TBlockHash } from "nano-account-crawler/dist/nano-interfaces";
import { NanoAccountForwardCrawler } from 'nano-account-crawler/dist/nano-account-forward-crawler';
import { NanoNode } from 'nano-account-crawler/dist/nano-node';
import { bananoIpfs } from "./lib/banano-ipfs";
import { parseFinishSupplyRepresentative, parseSupplyRepresentative } from "./block-parsers/supply";
import { validateMintBlock } from "./validate-mint-block";
import { ADDRESS_PATTERN, CANCEL_SUPPLY_REPRESENTATIVE, MAX_RPC_ITERATIONS, META_PROTOCOL_SUPPORTED_VERSIONS } from "./constants";
import { IMintBlock } from "./interfaces/mint-block";

// Crawler to find all mint blocks for a specific supply block
export class MintBlocksCrawler {
  private _hasLimitedSupply: boolean;
  private _head: TBlockHash;
  private _headHeight: number;
  private _ipfsCID: string;
  private _issuer: TAccount;
  private _nftSupplyBlock: INanoBlock;
  private _nftSupplyBlockHash: string;
  private _nftSupplyBlockHeight: bigint;
  private _maxSupply: bigint;
  private _metadataRepresentative: string;
  private _mintBlocks: INanoBlock[];
  private _mintBlockCount: bigint;
  private _version: string;
  private _finishedSupply: boolean;
  private _cachedData: boolean = false;

  constructor(issuer: TAccount, nftSupplyBlockHash: string) {
    this._issuer = issuer;
    this._nftSupplyBlockHash = nftSupplyBlockHash;
    this._finishedSupply = false;
    this._mintBlocks = [];
  }

  initFromCache(nftSupplyBlockHeight: bigint, mintBlockCount: bigint, version: string, maxSupply: bigint, metadataRepresentative: TAccount) {
    this._nftSupplyBlockHeight = nftSupplyBlockHeight;
    this._mintBlockCount = mintBlockCount;
    this._version = version;
    this._maxSupply = maxSupply;
    this._hasLimitedSupply = this._maxSupply > BigInt("0");
    this._finishedSupply = this.supplyExceeded();
    this._metadataRepresentative = metadataRepresentative;
  }

  private cachedCrawlData(): boolean {
    return typeof(this._nftSupplyBlockHeight) == 'bigint' && typeof(this._mintBlockCount) == 'bigint';
  }

  async crawl(nanoNode: NanoNode, maxRpcIterations: number = MAX_RPC_ITERATIONS) {
    if (this._finishedSupply) { return; }

    const banCrawler = new NanoAccountForwardCrawler(nanoNode, this._issuer, this._nftSupplyBlockHash);
    await banCrawler.initialize();
    banCrawler.maxRpcIterations = maxRpcIterations;

    this._mintBlocks = [];
    this._mintBlockCount = BigInt("0");
    let blockOffset: number = 0;

    // Crawl forward in issuer account from supply block
    for await (const block of banCrawler) {
      if (blockOffset === 0) {
        if (!this.parseSupplyBlock(block)) {
          throw Error(`SupplyBlockError: Unable to parse supply block: ${block.hash}`);
        }

      } else if (this.parseFinishSupplyBlock(block)) {
        this._finishedSupply = true;
        break;

      } else if (blockOffset === 1) {
        if (block.representative === CANCEL_SUPPLY_REPRESENTATIVE) {
          this._finishedSupply = true;
          break;
        } else {
          try {
            validateMintBlock(block as IMintBlock);
            this.parseFirstMint(block);
            this._mintBlocks.push(block);
            this._mintBlockCount++;
          } catch (error) {
            if (error.message.match(/^MintBlockError\:/)) {
              this._finishedSupply = true;
              break;
            } else {
              throw error;
            }
          }
        };

      } else if (blockOffset > 1 && block.representative === this._metadataRepresentative) {
        try {
          validateMintBlock(block as IMintBlock);
          this.addMintBlock(block);
        } catch (error) {
          if (!error.message.match(/^MintBlockError\:/)) {
            throw error;
          }
        }
      }

      if (this.supplyExceeded()) {
        this._finishedSupply = true;
        break;
      }
      blockOffset = blockOffset + 1;
    }
  }

  async crawlFromFrontier(nanoNode: NanoNode, frontier: TBlockHash, maxRpcIterations: number = MAX_RPC_ITERATIONS) {
    if (this._finishedSupply) { return; }
    if (!this.cachedSupplyBlock()) { throw Error(`CacheError: crawlFromFrontier: Supply block not cached`); }
    if (!this.cachedCrawlData()) { throw Error("CacheError: crawlFromFrontier: No cached crawl data"); }
    if (typeof(this._metadataRepresentative) !== 'string' && (this._metadataRepresentative as string).match(ADDRESS_PATTERN)) { throw Error("CacheError: crawlFromFrontier: No cached metadata representative"); }

    const banCrawler = new NanoAccountForwardCrawler(nanoNode, this._issuer, frontier, "1");
    await banCrawler.initialize();
    banCrawler.maxRpcIterations = maxRpcIterations;

    // Crawl forward in issuer account from supply block
    for await (const block of banCrawler) {
      if (this.parseFinishSupplyBlock(block)) {
        this._finishedSupply = true;
        break;
      } else if (block.representative === this._metadataRepresentative) {
        try {
          validateMintBlock(block as IMintBlock);
          this.addMintBlock(block);
          
        } catch (error) {
          if (!error.message.match(/^MintBlockError\:/)) {
            throw error;
          }
        }
      }

      if (this.supplyExceeded()) {
        this._finishedSupply = true;
        break;
      }
    }
  }

  addMintBlock(block: INanoBlock) {
    this._mintBlocks.push(block);
    this._mintBlockCount++;
    this._head = block.hash;
    this._headHeight = parseInt(block.height);
  }

  public get nftSupplyBlock() {
    return this._nftSupplyBlock;
  }

  public get mintBlocks() {
    return this._mintBlocks;
  }

  public get ipfsCID() {
    return this._ipfsCID;
  }

  public get version() {
    return this._version;
  }

  public get maxSupply() {
    return this._maxSupply;
  }

  public get hasLimitedSupply() {
    return this._hasLimitedSupply;
  }

  public get finishedSupply() {
    return this._finishedSupply;
  }

  public get mintBlockCount() {
    return this._mintBlockCount;
  }

  public get head(): (undefined | TBlockHash) {
    return this._head;
  }

  public get headHeight(): (undefined | number) {
    return this._headHeight;
  }

  private parseSupplyBlock(block: INanoBlock): boolean {
    const supplyData = parseSupplyRepresentative(block.representative);
    if (!supplyData) { return false }

    const { version, maxSupply } = supplyData;
    this._version = version;
    this._maxSupply = maxSupply;
    this._nftSupplyBlock = block;
    this._nftSupplyBlockHeight = BigInt(block.height);
    this._hasLimitedSupply = this._maxSupply > BigInt("0");
    return true;
  }

  private cachedSupplyBlock(): boolean {
    return META_PROTOCOL_SUPPORTED_VERSIONS.includes(this._version) && typeof(this._maxSupply) === 'bigint' && typeof(this._nftSupplyBlockHeight) === 'bigint' && typeof(this._hasLimitedSupply) == 'boolean';
  }

  private parseFinishSupplyBlock(block: INanoBlock): boolean {
    const finishSupplyData = parseFinishSupplyRepresentative(block.representative);
    if (!finishSupplyData) {
      return false;
    }

    const { supplyBlockHeight } = finishSupplyData;
    return supplyBlockHeight === this._nftSupplyBlockHeight;
  }

  private parseFirstMint(block: INanoBlock) {
    this._metadataRepresentative = block.representative;
    this._ipfsCID = bananoIpfs.accountToIpfsCidV0(this._metadataRepresentative);
  }

  private supplyExceeded(): boolean {
    return this._hasLimitedSupply && this._mintBlockCount >= this._maxSupply;
  }
}
