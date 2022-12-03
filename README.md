# banano-nft-crawler

Library for crawling across the Banano ledger to trace NFTs.

## SupplyBlocksCrawler

Crawls an account to find supply blocks.

## MintBlocksCrawler

Crawls an account to find mint blocks for a specific supply block.

## AssetCrawler

Crawls through several accounts if required to trace a single NFT from the mint block.

# TODO

* ~~Move this library and dependencies from GitHub to https://npmjs.com/~~
* ~~Generate a pure js build~~
* Set module.exports in index.ts
* Support asset caching and continuing from the cache instead of tracing all the way from the mint block every time.
* Add usage examples

# Naming conventions

From the Nano RPC, the account field is the recipient for send blocks.

For the banano-nft-crawler lib, in an IAssetBlock, the `account` field is used mark which account to mark which account to continue crawling in.

`owner` and `account` has different values in a `send#atomic_swap` block. The seller is the `owner` of the NFT until the buyer `account` sends the payment.

`head` or `crawlHead` usually refers to the latest block checked while crawling even if it isn't an IAssetBlock.

`frontier` in the context of the crawlers refer to the latest IAssetBlock that can be behind the head.

# See also

These crawlers are extracted from:

https://github.com/Airtune/banano-metanode-nft-ts

Banano NFT protocol specification:

https://github.com/Airtune/73-meta-tokens
