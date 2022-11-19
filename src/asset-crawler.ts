// interfaces
import { INanoBlock } from "nano-account-crawler/dist/nano-interfaces";
import { IAssetBlock } from "./interfaces/asset-block";
import { IAtomicSwapConditions } from "./interfaces/atomic-swap-conditions";

// types
import { TAccount, TBlockHash } from "./types/banano";

// packages
import { NanoNode } from 'nano-account-crawler/dist/nano-node';

// lib
import { bananoIpfs } from "./lib/banano-ipfs";

// meta node
import { MAX_TRACE_LENGTH } from "./constants";
import { parseAtomicSwapRepresentative } from "./block-parsers/atomic-swap";

// meta block states
import { burnedCrawl } from "./asset-crawler-states/asset/burned";
import { assetMintCrawl } from "./asset-crawler-states/asset/mint";
import { ownedCrawl } from "./asset-crawler-states/asset/owned";
import { receivableCrawl } from "./asset-crawler-states/asset/receivable";
import { atomicSwapReceivableCrawl } from "./asset-crawler-states/atomic-swap/atomic-swap-receivable";
import { atomicSwapPayableCrawl } from "./asset-crawler-states/atomic-swap/atomic-swap-payable";
import { returnToNFTSellerCrawl } from "./asset-crawler-states/return-to-nft-seller";

const assetCrawlerStates = {
  "burned": burnedCrawl,
  "owned": ownedCrawl,
  "receivable": receivableCrawl,
  "atomic_swap_receivable": atomicSwapReceivableCrawl,
  "atomic_swap_payable": atomicSwapPayableCrawl,
  "(return_to_nft_seller)": returnToNFTSellerCrawl
};

// Crawler to trace the chain following a single mint of an asset.
export class AssetCrawler {
  private _assetChain: IAssetBlock[];
  private _assetRepresentative: string;
  private _head: TBlockHash;
  private _headHeight: number;
  private _metadataRepresentative: string;
  private _issuer: string;
  private _mintBlock: INanoBlock;
  private _traceLength: bigint;

  public activeAtomicSwap: IAssetBlock;
  public activeAtomicSwapDelegation: IAssetBlock;
  public owner: string;
  public locked: boolean;
  public lockedInAccount: string;

  constructor(issuer: string, mintBlock: INanoBlock) {
    this._issuer = issuer;
    this._mintBlock = mintBlock;
    this._assetChain = [];
    this._traceLength = undefined;
  }

  async crawl(nanoNode: NanoNode, maxTraceLength: bigint = MAX_TRACE_LENGTH) {
    this._assetRepresentative = bananoIpfs.publicKeyToAccount(this._mintBlock.hash);
    this._metadataRepresentative = this._mintBlock.representative;
    this._traceLength = BigInt(1);

    if (!this._assetChain || this._assetChain.length === 0) {
      await assetMintCrawl(nanoNode, this, this._mintBlock).catch((error) => { throw(error) });
    }

    await this.crawlFromFrontier(nanoNode, maxTraceLength);
  }

  initFromCache(assetRepresentative: string, assetChain: IAssetBlock[], initialTraceLength: bigint = undefined) {
    this._assetRepresentative = assetRepresentative;
    this._assetChain = assetChain;
    this._traceLength = initialTraceLength || this._traceLength;
  }

  async crawlFromFrontier(nanoNode: NanoNode, maxTraceLength: bigint = MAX_TRACE_LENGTH) {
    let newStep = true;
    while (newStep) {
      newStep = await this.crawlStep(nanoNode).catch((error) => { throw(error) });
      if (this._traceLength >= maxTraceLength) {
        break;
      }
    }
  }

  private async crawlStep(nanoNode: NanoNode): Promise<boolean> {
    const stateCrawlFn = assetCrawlerStates[this.frontier.state];

    if (typeof stateCrawlFn == "function") {
      return await stateCrawlFn(nanoNode, this).catch((error) => { throw(error) });
    } else {
      throw Error(`UnhandledAssetState: "${this.frontier.state}" was not handled for block: ${this.frontier.nanoBlock.hash}`);
    }
  }

  // Return minRaw for atomic swap payment if asset is ready for payment. Otherwise return undefined.
  public currentAtomicSwapConditions(): IAtomicSwapConditions | undefined {
    if (this.assetChain[this.assetChain.length - 1].state !== "atomic_swap_payable") {
      return undefined;
    }

    const sendAtomicSwap: IAssetBlock = this.findSendAtomicSwapBlock();
    if (sendAtomicSwap === undefined) { return undefined; }

    const atomicSwapRepresentative: TAccount = sendAtomicSwap.nanoBlock.representative as TAccount;
    const atomicSwapConditions: IAtomicSwapConditions = parseAtomicSwapRepresentative(atomicSwapRepresentative);

    return atomicSwapConditions;
  }

  public findSendAtomicSwapBlock(): IAssetBlock | undefined {
    if (this.assetChain[this.assetChain.length - 2].state !== "atomic_swap_receivable") {
      return undefined;
    }

    const sendAtomicSwap: IAssetBlock = this.assetChain[this.assetChain.length - 2];
    return sendAtomicSwap;
  }

  public get assetChain() {
    return this._assetChain;
  }

  public get frontier(): IAssetBlock {
    return this._assetChain[this._assetChain.length - 1];
  }

  public get previousFrontier(): IAssetBlock {
    return this._assetChain[this._assetChain.length - 2];
  }

  public get assetRepresentative() {
    return this._assetRepresentative;
  }

  public get head(): (undefined | TBlockHash) {
    return this._head;
  }

  public set head(value: TBlockHash) {
    this._head = value;
  }

  public get headHeight(): (undefined | number) {
    return this._headHeight;
  }

  public set headHeight(value: number) {
    this._headHeight = value;
  }

  public get issuer() {
    return this._issuer;
  }

  public get metadataRepresentative() {
    return this._metadataRepresentative;
  }

  public get traceLength() {
    return this._traceLength;
  }

  public set traceLength(len: bigint) {
    this._traceLength = len;
  }
}
