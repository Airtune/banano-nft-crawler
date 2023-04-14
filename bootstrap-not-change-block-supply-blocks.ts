import * as fs from 'fs';

import { INanoBlock, TAccount, TBlockHash } from "nano-account-crawler/dist/nano-interfaces";
import { SupplyBlocksCrawlerNotChangeBlock } from "./src/supply-blocks-crawler-not-change-block";
import { bananode } from './bananode';
import { MintBlocksCrawler } from './src/mint-blocks-crawler';
import { bananoIpfs } from './src/lib/banano-ipfs';
import { IStatusReturn } from 'nano-account-crawler/dist/status-return-interfaces';
import { getBlock } from './src/lib/get-block';
import { AssetCrawler } from './src/asset-crawler';

const issuers: TAccount[] = [
  "ban_1akutedg199khq5ujhy8a9yaywhwigihja8baoqn6pwjpquiejrkcdpoo1yx"
]
const main = async () => {
  for (let i = 0; i < issuers.length; i++) {
    const issuer = issuers[i];
    const supplyBlocksCrawler = new SupplyBlocksCrawlerNotChangeBlock(issuer);

    const supplyBlocks = await supplyBlocksCrawler.crawl(bananode, 10000).catch((error) => { throw (error) });
    const supplyBlockHashes = supplyBlocks.map((supplyBlock) => { return supplyBlock.hash; });
    console.log(JSON.stringify(supplyBlockHashes));

    const output: any = {};

    output.supply_block_hashes = supplyBlockHashes;
    output.mint_block_hashes = {};
    output.nfts_by_supply_block_hash = {};

    for (let j = 0; j < supplyBlockHashes.length; j++) {
      const supplyBlockHash = supplyBlockHashes[j];

      console.log(`\n\n-------------------\nSupply block hash: ${supplyBlockHash}\n`)
      const mintBlocksCrawler = new MintBlocksCrawler(issuer, supplyBlockHash);
      await mintBlocksCrawler.crawl(bananode).catch((error) => { throw (error) });
      const mintBlocks: INanoBlock[] = mintBlocksCrawler.mintBlocks;
      const mintBlocksHashes: TBlockHash[] = mintBlocks.map((block) => { return block.hash; });

      output.mint_block_hashes[supplyBlockHash] = mintBlocksHashes;

      
      for (let k = 0; k < mintBlocksHashes.length; k++) {
        const mintBlockHash = mintBlocksHashes[k];
        console.log(`Tracing NFT ${k} from mint block hash: ${mintBlockHash}`);

        const assetRepresentative = bananoIpfs.publicKeyToAccount(mintBlockHash);
        const mintBlockStatusReturn: IStatusReturn<INanoBlock | undefined> = await getBlock(bananode, issuer, mintBlockHash).catch((error) => { throw (error); });
        if (mintBlockStatusReturn.status === "error" || !mintBlockStatusReturn.value) {
          throw 'undefined mintBlock';
        }
        const assetCrawler = new AssetCrawler(issuer, mintBlockStatusReturn.value);
        const crawlResult = await assetCrawler.crawl(bananode).catch((error) => { throw (error) });
        if (crawlResult.status === "error") { throw crawlResult.message; }

        output.nfts_by_supply_block_hash[supplyBlockHash] ||= []
        output.nfts_by_supply_block_hash[supplyBlockHash].push({
          mint_block_hash: mintBlockHash,
          mint_number: k+1,
          owner: assetCrawler.frontier.owner,
        });
      }
    }

    fs.writeFileSync(`./bootstrap/${issuer}.json`, JSON.stringify(output));
  }
}

main();
