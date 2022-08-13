# banano-nft-crawler

Library for crawling across the Banano ledger to trace NFTs.

## SupplyBlocksCrawler

Crawls an account to find supply blocks.

## MintBlocksCrawler

Crawls an account to find mint blocks for a specific supply block.

## AssetCrawler

Crawls through several accounts if required to trace a single NFT from the mint block.

# TODO

* Move this library and dependencies from GitHub to https://npmjs.com/
* Generate a pure js build
* Set module.exports in index.ts
* Asset caching and continuing from the cache instead of tracing all the way from the mint block every time.

# See also

These crawlers are extracted from:

https://github.com/Airtune/banano-metanode-nft-ts

Banano NFT protocol specification:

https://github.com/Airtune/73-meta-tokens
