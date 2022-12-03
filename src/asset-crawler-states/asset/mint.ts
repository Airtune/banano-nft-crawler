import { AssetCrawler } from "../../asset-crawler";
import { INanoBlock, TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { NanoNode } from "nano-account-crawler/dist/nano-node";

export async function assetMintCrawl(_nanoNode: NanoNode, assetCrawler: AssetCrawler, _mintBlock: INanoBlock): Promise<boolean> {
  if (_mintBlock.subtype == 'send' && _mintBlock.type === 'state') {
    const recipientAccount = _mintBlock.account;
    assetCrawler.assetChain.push({
      state: 'receivable',
      type: 'send#mint',
      account: recipientAccount,
      owner: recipientAccount,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: _mintBlock.link,
      block_hash: _mintBlock.hash,
      block_height: _mintBlock.height,
      block_account: _mintBlock.account,
      block_representative: _mintBlock.representative,
      block_type: _mintBlock.type,
      block_subtype: _mintBlock.subtype,
      block_amount: _mintBlock.amount
    });
    assetCrawler.head = _mintBlock.hash;
    assetCrawler.headHeight = parseInt(_mintBlock.height);
    return true;

  } else if (_mintBlock.subtype == 'change' && _mintBlock.type === 'state') {
    assetCrawler.assetChain.push({
      state: 'owned',
      type: 'change#mint',
      account: assetCrawler.issuer,
      owner: assetCrawler.issuer,
      locked: false,
      traceLength: assetCrawler.traceLength,
      block_link: _mintBlock.link,
      block_hash: _mintBlock.hash,
      block_height: _mintBlock.height,
      block_account: _mintBlock.account,
      block_representative: _mintBlock.representative,
      block_type: _mintBlock.type,
      block_subtype: _mintBlock.subtype,
      block_amount: _mintBlock.amount
    });
    assetCrawler.head = _mintBlock.hash;
    assetCrawler.headHeight = parseInt(_mintBlock.height);
    return true;

  } else {
    throw Error(`MintBlockError: Unexpected mint block subtype: ${_mintBlock.subtype}. Expected 'send' or 'change'`);

  }
}
