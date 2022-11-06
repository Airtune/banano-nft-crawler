import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { AssetCrawler } from '../src/asset-crawler';
import { bananode } from '../bananode';
import { getBlock } from '../src/lib/get-block';
import { TAccount, TBlockHash } from '../src/types/banano';
import { IAssetBlock } from '../src/interfaces/asset-block';
import { INanoBlock } from 'nano-account-crawler/dist/nano-interfaces';
import { twosAssetChain } from './data/twos-asset-chain';
import { bananoIpfs } from '../src/lib/banano-ipfs';

chai.use(chaiAsPromised);
const expect = chai.expect;

const issuer: TAccount = "ban_1ty5s13h9tg9f57gwsto8njkzejfu9tjasc8a9mn1wujfxib8dj7w54jg3qm";
const swapIssuer: TAccount = "ban_1swapxh34bjstbc8c5tonbncw5nrc6sgk7h71bxtetty3huiqcj6mja9rxjt";
let swapMintBlock;
let swapAssetCrawler;

const testSlice = async (start: number, end: number) => {
  const recipient: TAccount = "ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf";
    
  const mintBlockHash = "F61CCF94D6E5CFE9601C436ACC3976AF876D1DA21909FEB88B629BEDEC4DF1EA";
  const assetRepresentative = bananoIpfs.publicKeyToAccount(mintBlockHash);
  const mintBlock = await getBlock(bananode, issuer, mintBlockHash).catch((error) => { throw(error) });
  if (mintBlock === undefined) { throw 'undefined mintBlock'; }
  const assetCrawler = new AssetCrawler(issuer, mintBlock);

  assetCrawler.initFromCache(assetRepresentative, twosAssetChain.slice(0, 1))
  await assetCrawler.crawl(bananode).catch((error) => { throw(error) });
  
  const assetBlocksHashes1: TBlockHash[] = assetCrawler.assetChain.map((block) => { return block.nanoBlock.hash; });
  const assetBlocksHashes2: TBlockHash[] = twosAssetChain.map(         (block) => { return block.nanoBlock.hash; });
  expect(assetBlocksHashes1).to.deep.equal(assetBlocksHashes2);

  const assetStates1: TBlockHash[] = assetCrawler.assetChain.map((block) => { return block.state; });
  const assetStates2: TBlockHash[] = twosAssetChain.map(         (block) => { return block.state; });
  expect(assetStates1).to.deep.equal(assetStates2);

  const assetAccounts1: TBlockHash[] = assetCrawler.assetChain.map((block) => { return block.account + block.owner; });
  const assetAccounts2: TBlockHash[] = twosAssetChain.map(         (block) => { return block.account + block.owner; });
  expect(assetAccounts1).to.deep.equal(assetAccounts2);
};

describe('AssetCrawler', function () {
  // 20 seconds timeout so I can test under poor network conditions :')
  this.timeout(20000);

  // IPFS CID: QmPDFGyV7QKdT4MvV8vhuvPYsDoy66KxqDzB93mpne6tQ5
  // Corresponding Metadata Representative: ban_159p616fwg36pynrh3i4b3p6qg4oxxxemypxgz6ubzid65kbcd4y4kpu5p6b
  before(async () => {
    swapMintBlock = await getBlock(bananode, swapIssuer, "439F5CB566E957576C2473B7AF6F3D7D17FBF5022685EB70ED825EAC3B84A56A").catch((error) => { throw(error) });
    swapAssetCrawler = new AssetCrawler(swapIssuer, swapMintBlock);
    await swapAssetCrawler.crawl(bananode).catch((error) => { throw(error) });
  });

  it("confirms partial trace 1 from head for change#mint > send#asset > receive#asset", async () => {
    await testSlice(0, 1);
  });

  it("confirms partial trace 2 from head for change#mint > send#asset > receive#asset", async () => {
    await testSlice(0, 2);
  });

  it("confirms partial trace 3 from head for change#mint > send#asset > receive#asset", async () => {
    await testSlice(0, 3);
  });

  it("confirms change#mint > send#asset > receive#asset", async () => {
    const recipient: TAccount = "ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf";
    const mintBlockHash = "F61CCF94D6E5CFE9601C436ACC3976AF876D1DA21909FEB88B629BEDEC4DF1EA";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash).catch((error) => { throw(error) });
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode).catch((error) => { throw(error) });
    const assetFrontier: IAssetBlock = assetCrawler.frontier;
    expect(assetFrontier.account).to.equal(recipient);
    expect(assetFrontier.owner).to.equal(recipient);
    expect("owned").to.equal(assetFrontier.state);
    expect("receive#asset").to.equal(assetFrontier.type);
    expect(false).to.equal(assetFrontier.locked);
    expect(assetFrontier.nanoBlock.hash).to.equal('201D206790E46B4CB24CA9F0DB370F8F4BA2E905D66E8DE825D36A9D0E775DAB');
    // double check assetChain matches cached twosAssetChain
    const assetBlocksHashes1: TBlockHash[] = assetCrawler.assetChain.map((block) => { return block.nanoBlock.hash; });
    const assetBlocksHashes2: TBlockHash[] = twosAssetChain.map(         (block) => { return block.nanoBlock.hash; });
    expect(assetBlocksHashes1).to.deep.equal(assetBlocksHashes2);

    const assetStates1: TBlockHash[] = assetCrawler.assetChain.map((block) => { return block.state; });
    const assetStates2: TBlockHash[] = twosAssetChain.map(         (block) => { return block.state; });
    expect(assetStates1).to.deep.equal(assetStates2);

    const assetAccounts1: TBlockHash[] = assetCrawler.assetChain.map((block) => { return block.account + block.owner; });
    const assetAccounts2: TBlockHash[] = twosAssetChain.map(         (block) => { return block.account + block.owner; });
    expect(assetAccounts1).to.deep.equal(assetAccounts2);
  });

  it("confirms send#mint > receive#asset", async () => {
    const recipient: TAccount = "ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf";
    const mintBlockHash = "EFE6CCFDE4FD56E60F302F22DCF41E736F611124E3F463135FDC31769A68B970";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash).catch((error) => { throw(error) });
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode).catch((error) => { throw(error) });
    const assetFrontier: IAssetBlock = assetCrawler.frontier;
    expect(recipient).to.equal(assetFrontier.account);
    expect(recipient).to.equal(assetFrontier.owner);
    expect("owned").to.equal(assetFrontier.state);
    expect("receive#asset").to.equal(assetFrontier.type);
    expect(false).to.equal(assetFrontier.locked);
  });

  it("send all NFTs command sends all NFTs", async () => {
    const sendAllIssuer: TAccount = "ban_1sweep4n54fbbrzaj1cnr7drf4udbf6f66un3zikhwm6f497pk5ftar3tekj";
    const recipient: TAccount = "ban_3testz6spgm48ax8kcwah6swo59sroqfn94fqsgq368z7ki44ccg8hhrx3x8";

    // sent with send all assets command, received
    const mintBlock1 = await getBlock(bananode, sendAllIssuer, "698625D8B57D695D45D4597EF5EEBC7DC31B9A706CCA1D26EAA72F8063B6E385").catch((error) => { throw(error) });
    if (mintBlock1 === undefined) { throw 'undefined mintBlock1'; }
    const nft1AssetCrawler = new AssetCrawler(sendAllIssuer, mintBlock1);
    await nft1AssetCrawler.crawl(bananode).catch((error) => { throw(error) });
    const nft1Frontier: IAssetBlock = nft1AssetCrawler.frontier;
    expect(nft1Frontier.owner).to.equal(recipient);
    expect(nft1Frontier.nanoBlock.hash).to.equal("024ACA494596E054C94E86A11C881018F6A0D73B108D1A0D15A66F91ADCEC1D8"); // !!! Manually validate

    // sent with send all assets command, received, sent back to sendAllIssuer, and then received by sendAllIssuer again.
    const mintBlock2 = await getBlock(bananode, sendAllIssuer, "56A2251E0C20CE9B81269E1916858FB2FE178543FA2ED05522D66FC74EC6DD8D");
    if (mintBlock2 === undefined) { throw 'undefined mintBlock2'; }
    const nft2AssetCrawler = new AssetCrawler(sendAllIssuer, mintBlock2);
    await nft2AssetCrawler.crawl(bananode);
    const nft2Frontier: IAssetBlock = nft2AssetCrawler.frontier;
    expect(nft2Frontier.owner).to.equal(sendAllIssuer);
    expect(nft2Frontier.nanoBlock.hash).to.equal("D29F111B51E113F58A1805379CB880564402B6DC430B59DE4598E5A5ED36AF3A"); // !!! Manually validate

    // sent with send all assets command, received
    const mintBlock3 = await getBlock(bananode, sendAllIssuer, "A8748C3ABC82C1FC18CD2E9A2AB1AA13E5FCC88F71B1BEBF0C44BE7A520AD393");
    if (mintBlock3 === undefined) { throw 'undefined mintBlock3'; }
    const nft3AssetCrawler = new AssetCrawler(sendAllIssuer, mintBlock3);
    await nft3AssetCrawler.crawl(bananode);
    const nft3Frontier: IAssetBlock = nft3AssetCrawler.frontier;
    expect(nft3Frontier.owner).to.equal(recipient);
    expect(nft3Frontier.nanoBlock.hash).to.equal("024ACA494596E054C94E86A11C881018F6A0D73B108D1A0D15A66F91ADCEC1D8"); // !!! Manually validate

    // NFT5 minted after the send all assets command
    const mintBlock5 = await getBlock(bananode, sendAllIssuer, "95C9F6EE6038C3DBD7450EC3435203FF3C623EEA8673B7E41077D3DBE875325C");
    if (mintBlock5 === undefined) { throw 'undefined mintBlock5'; }
    const nft5AssetCrawler = new AssetCrawler(sendAllIssuer, mintBlock5);
    await nft5AssetCrawler.crawl(bananode);
    const nft5Frontier: IAssetBlock = nft5AssetCrawler.frontier;
    expect(sendAllIssuer).to.equal(nft5Frontier.owner);
    expect(nft5Frontier.nanoBlock.hash).to.equal("95C9F6EE6038C3DBD7450EC3435203FF3C623EEA8673B7E41077D3DBE875325C"); // !!! Manually validate // !!! Manually validate
  });

  // Note that this test relies on an NFT from the test above succeeding.
  it("doesn't transfer ownership while send#atomic_swap and receive#atomic swap is confirmed but send#payment or #abort_payment isn't submitted on-chain", async () => {
    const sendAllIssuer: TAccount = "ban_1sweep4n54fbbrzaj1cnr7drf4udbf6f66un3zikhwm6f497pk5ftar3tekj";
    const owner: TAccount = "ban_3testz6spgm48ax8kcwah6swo59sroqfn94fqsgq368z7ki44ccg8hhrx3x8";
    const payingAccount: TAccount = "ban_3cantszxkej3kzcjjpxcu35jcn6ck884uu3q8ypd3xc1e1y61tt6jj7p99yd";

    // sent with send all assets command, received, send#atomic_swap confirmed, receive#atomic_swap confirmed, payment or abort block isn't submitted on-chain
    const mintBlock4 = await getBlock(bananode, sendAllIssuer, "9DBA255E5D311A5D519CF3B3D182E7120D8A94BCF450FFFB7C44FF9569B41CCF");
    if (mintBlock4 === undefined) { throw 'undefined mintBlock4'; }
    const nft4AssetCrawler = new AssetCrawler(sendAllIssuer, mintBlock4);
    await nft4AssetCrawler.crawl(bananode);
    const nft4Frontier: IAssetBlock = nft4AssetCrawler.frontier;
    expect(true).to.equal(nft4Frontier.locked);
    expect(owner).to.equal(nft4Frontier.owner);
    expect(payingAccount).to.equal(nft4Frontier.account);
    expect("atomic_swap_payable").to.equal(nft4Frontier.state);
    expect("receive#atomic_swap").to.equal(nft4Frontier.type);
  });

  it("unreceived change#mint, send#asset is owned by recipient but not sendable", async () => {
    const recipient: TAccount = "ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf";
    const mintBlockHash = "88A047DA0CF8A07568D8E3BEC6030587988A11581906CBBF372DE32385F35F16";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash);
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode);
    const assetFrontier: IAssetBlock = assetCrawler.frontier;
    expect(recipient).to.equal(assetFrontier.account);
    expect(recipient).to.equal(assetFrontier.owner);
    expect("receivable").to.equal(assetFrontier.state);
    expect("send#asset").to.equal(assetFrontier.type);
    expect(false).to.equal(assetFrontier.locked);
  });

  it("unreceived send#mint is owned by recipient but not sendable", async () => {
    const recipient: TAccount = "ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf";
    const mintBlockHash = "D051A922C775616CADC97EB29FD6D75AA514D05ABA4A1252F8B626C9C4F863E8";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash);
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode);
    const assetFrontier: IAssetBlock = assetCrawler.frontier;
    expect(assetCrawler.issuer).to.equal(issuer);
    expect(assetFrontier.owner).to.equal(recipient);
    expect(assetFrontier.state).to.equal("receivable");
    expect(assetFrontier.type).to.equal("send#mint");
    expect(assetFrontier.locked).to.equal(false);
    expect(assetFrontier.nanoBlock.hash).to.equal('D051A922C775616CADC97EB29FD6D75AA514D05ABA4A1252F8B626C9C4F863E8');
  });

  it("is unable to send assets owned by someone else", async () => {
    const unrelatedAccount1: TAccount = "ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf";
    const unrelatedAccount2: TAccount = "ban_1oozinhbrw7nrjfmtq1roybi8t7q7jywwne4pjto7oy78injdmn4n3a5w5br";
    const mintBlockHash = "777B8264AFDF004C77285CBBA7F208D2BB5A64118FBB5DCCA7D2619374CB3C4A";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash);
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode);

    expect(assetCrawler.frontier.owner).to.equal(issuer);
    expect(assetCrawler.frontier.nanoBlock.hash).to.equal('777B8264AFDF004C77285CBBA7F208D2BB5A64118FBB5DCCA7D2619374CB3C4A');

    const assetChain: IAssetBlock[] = assetCrawler.assetChain;
    for (let i = 0; i < assetChain.length; i++) {
      const assetBlock: IAssetBlock = assetChain[i];
      expect(unrelatedAccount1).to.not.equal(assetBlock.account);
      expect(unrelatedAccount2).to.not.equal(assetBlock.account);
      expect(unrelatedAccount1).to.not.equal(assetBlock.owner);
      expect(unrelatedAccount2).to.not.equal(assetBlock.owner);
      expect("3F39BE1635C5ECB85741BDE22C879484DE67832F8E140678D3B3C25D42C081FB").to.not.equal(assetBlock.nanoBlock.hash);
      expect("CAE3296E2AC94C18DFEFAA29D4EAD828108ACC3F1C2B0789868E064F596A71A3").to.not.equal(assetBlock.nanoBlock.hash);
    }
  });

  it("ignores send#asset block for asset you have already sent with a send#mint block", async () => {
    const mintBlockHash = "6F7ED78C5A40145EDCA76B63B1F525DC38A6A4597D59274FBEEED32619C8AF43";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash);
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode);

    expect("ban_1oozinhbrw7nrjfmtq1roybi8t7q7jywwne4pjto7oy78injdmn4n3a5w5br").to.not.equal(assetCrawler.frontier.owner);
    expect("ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf").to.equal(assetCrawler.frontier.owner);
  });

  it("traces chain of sends", async () => {
    // send#mint
    const mintBlockHash = "87F0D105A36BA43C87AF399B84B8BBF8EED0BDD71279AACC33496809D5E28B66";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash);
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode);

    expect(4).to.equal(assetCrawler.assetChain.length);
    expect("send#mint").to.equal(assetCrawler.assetChain[0].type);
    expect("receivable").to.equal(assetCrawler.assetChain[0].state);
    expect(issuer).to.equal(assetCrawler.issuer);
    expect("ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf").to.equal(assetCrawler.assetChain[0].owner);

    expect("receive#asset").to.equal(assetCrawler.assetChain[1].type);
    expect("owned").to.equal(assetCrawler.assetChain[1].state);
    expect("ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf").to.equal(assetCrawler.assetChain[1].account);
    expect("ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf").to.equal(assetCrawler.assetChain[1].owner);

    expect("send#asset").to.equal(assetCrawler.assetChain[2].type);
    expect("receivable").to.equal(assetCrawler.assetChain[2].state);
    expect("ban_1oozinhbrw7nrjfmtq1roybi8t7q7jywwne4pjto7oy78injdmn4n3a5w5br").to.equal(assetCrawler.assetChain[2].account);
    expect("ban_1oozinhbrw7nrjfmtq1roybi8t7q7jywwne4pjto7oy78injdmn4n3a5w5br").to.equal(assetCrawler.assetChain[2].owner);

    expect("receive#asset").to.equal(assetCrawler.assetChain[3].type);
    expect("owned").to.equal(assetCrawler.assetChain[3].state);
    expect("ban_1oozinhbrw7nrjfmtq1roybi8t7q7jywwne4pjto7oy78injdmn4n3a5w5br").to.equal(assetCrawler.assetChain[3].account);
    expect("ban_1oozinhbrw7nrjfmtq1roybi8t7q7jywwne4pjto7oy78injdmn4n3a5w5br").to.equal(assetCrawler.assetChain[3].owner);

    expect("ban_1oozinhbrw7nrjfmtq1roybi8t7q7jywwne4pjto7oy78injdmn4n3a5w5br").to.equal(assetCrawler.frontier.owner);
  });

  it("ignores send#asset before receive#asset and after previously confirmed send#asset", async () => {
    // send#mint
    const mintBlockHash = "68EB50EF45651590ECC6136D20BBC8D68ECF0C352FC50DBFEC00C3DB3F5F934D";
    const mintBlock = await getBlock(bananode, issuer, mintBlockHash);
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(issuer, mintBlock);
    await assetCrawler.crawl(bananode);

    const assetChain: IAssetBlock[] = assetCrawler.assetChain;

    // ignore send#asset block before receive#asset
    for (let i = 0; i < assetChain.length; i++) {
      const assetBlock = assetChain[i];
      const invalidSendHashes = [
        // before receive#asset
        "A21E26AC888B642F84FAF3728A6D32B027502CE9F1F86F720B91A71D49BFE52C",
        "05CF4BEA4075DFBE690E9EC0DF581CC237D9C14AF7CEECDE9E53F1426AD0F572",
        "1D065B49CC53BB693438F55C068E74BBF36DBE6C409C82EB537EFEF257EF6104",
        // send#asset after previously confirmed send#asset
        "62DCF26825FA44C394D1C468BCB6B69E779C9E17899DB04B4489C33FB58057EF"
      ]
      expect(invalidSendHashes).to.not.include(assetBlock.nanoBlock.hash);
    }

    // previously confirmed send#asset 
    expect("send#asset").to.equal(assetChain[2].type);
    expect("ban_3testz6spgm48ax8kcwah6swo59sroqfn94fqsgq368z7ki44ccg8hhrx3x8").to.equal(assetChain[2].owner);
    expect("31C4279ACE505BFACE38BBE4883B1D928C7742BE0C042FF92C8D69C6C8D4B1E1").to.equal(assetChain[2].nanoBlock.hash);
  });

  it("confirms completed valid atomic swap", async () => {
    const swapIssuer: TAccount = "ban_1swapxh34bjstbc8c5tonbncw5nrc6sgk7h71bxtetty3huiqcj6mja9rxjt";
    const mintBlockHash: TBlockHash = "01C876EE1CB115E166BF96FB1218EE0107CF07B6F9FD62ED02A40062360DF20A";
    const mintBlock = await getBlock(bananode, swapIssuer, mintBlockHash);
    if (mintBlock === undefined) { throw 'undefined mintBlock'; }
    const assetCrawler = new AssetCrawler(swapIssuer, mintBlock);
    await assetCrawler.crawl(bananode);

    expect(assetCrawler.frontier.nanoBlock.hash).to.equal("E8285EBCF17C5FD0DFDCE086253A72D4795032FB5E23F8D13880954D8BB8AE56");
    expect(assetCrawler.frontier.owner).to.equal("ban_1buyayd6csb1rwprgcks9sif66hthrbu9jah5ehspmsxghi63ter8f66cy1p");
  });

  it("ignores invalid send#atomic_swap where encoded receive height is less than 2", async () => {
    expect(3).to.equal(swapAssetCrawler.assetChain.length);
  });

  it("ignores invalid send#atomic_swap where exact raw amount sent isn't exactly 1 raw", async () => {
    const issuer: TAccount = "ban_3cantszxkej3kzcjjpxcu35jcn6ck884uu3q8ypd3xc1e1y61tt6jj7p99yd";
    // Followed by invalid 2 raw send#atomic_swap block: 5F39FC09F6B0637968E44CF3E9DA25BAF69529CCCCAFE0B92D765B647C54FAB1
    const cantMintBlock5 = await getBlock(bananode, issuer, "3B8A04CC4D4219265AF0A5AC71B2340B025A58270FF3845F680FA95ABE1F58EE");
    if (cantMintBlock5 === undefined) { throw 'undefined cantMintBlock5'; }
    const cantAssetCrawler5 = new AssetCrawler(issuer, cantMintBlock5);
    await cantAssetCrawler5.crawl(bananode);

    expect(issuer).to.equal(cantAssetCrawler5.frontier.owner);
    expect("owned").to.equal(cantAssetCrawler5.frontier.state);
    expect("change#mint").to.equal(cantAssetCrawler5.frontier.type); // ignore send#atomic_swap with 2 raw
    expect(false).to.equal(cantAssetCrawler5.frontier.locked);

    // Followed by invalid 3 raw send#atomic_swap block: 9EBE52B3D14D77E5CA8B33B12588627E13D606688352F15F061EC44C3D4613B3
    const cantMintBlock6 = await getBlock(bananode, issuer, "F08725F34398942CADE0BD9F151CFB71ECFCDC408B3D73A2072373CBF153D695");
    if (cantMintBlock6 === undefined) { throw 'undefined cantMintBlock6'; }
    const cantAssetCrawler6 = new AssetCrawler(issuer, cantMintBlock6);
    await cantAssetCrawler6.crawl(bananode);

    expect(issuer).to.equal(cantAssetCrawler6.frontier.owner);
    expect("owned").to.equal(cantAssetCrawler6.frontier.state);
    expect("change#mint").to.equal(cantAssetCrawler6.frontier.type); // ignore send#atomic_swap with 3 raw
    expect(false).to.equal(cantAssetCrawler6.frontier.locked);
  });

  it("cancels atomic swap if paying account balance is less than min raw in block at: receive height - 1", async () => {
    expect("F8BD752EDB490FC4B505ED878981240A79DB5C0490F7242388EF5E183E17EF29").to.equal(swapAssetCrawler.frontier.nanoBlock.hash);
    expect("ban_1swapxh34bjstbc8c5tonbncw5nrc6sgk7h71bxtetty3huiqcj6mja9rxjt").to.equal(swapAssetCrawler.frontier.owner);
    expect("owned").to.equal(swapAssetCrawler.frontier.state);
    expect("send#returned_to_sender").to.equal(swapAssetCrawler.frontier.type);
  });

  // Todo: check if there's other variables that can change the block hash to break the atomic swap
  it("cancels atomic swap if receive#atomic_swap block has a different representative than previous block", async () => {
    const failSwapIssuer: TAccount = "ban_1swapxh34bjstbc8c5tonbncw5nrc6sgk7h71bxtetty3huiqcj6mja9rxjt";
    const failSwapMintBlock: (INanoBlock | undefined) = await getBlock(bananode, failSwapIssuer, "09ABEBF530CD96A30FA4F58B458AB7378DF6432CFC39040F6224195A006D65BA");
    if (failSwapMintBlock === undefined) { throw 'undefined failSwapMintBlock'; }
    const failSwapAssetCrawler = new AssetCrawler(failSwapIssuer, failSwapMintBlock);
    await failSwapAssetCrawler.crawl(bananode);

    // The receive block that changes representative and is expected to be invalid is:
    // CCBBB68F1C216C45F76C175BB2116F97080512C84D0A4830E0186DADFEF56921
    expect(failSwapAssetCrawler.frontier.nanoBlock.hash).to.equal("2EEFFD2621E2260255F200131B3CAF3D25271076DB5E8AE856DCE8BBB2DC1875");
    expect(failSwapAssetCrawler.frontier.owner).to.equal("ban_1swapxh34bjstbc8c5tonbncw5nrc6sgk7h71bxtetty3huiqcj6mja9rxjt");
    expect(failSwapAssetCrawler.frontier.state).to.equal("owned");
    expect(failSwapAssetCrawler.frontier.type).to.equal("send#returned_to_sender");
  });

  it("cancels atomic swap if a block other than the relevant receive#atomic_swap is confirmed at receive_height", async () => {
    const issuer: TAccount = "ban_3cantszxkej3kzcjjpxcu35jcn6ck884uu3q8ypd3xc1e1y61tt6jj7p99yd";
    const cantMintBlock1 = await getBlock(bananode, issuer, "050D2C75CE68241CF5E3CD180411A73A75A1781D5B2D5BAA26059A06811689A7");
    if (cantMintBlock1 === undefined) { throw 'undefined cantMintBlock1'; }
    const cantAssetCrawler1 = new AssetCrawler(issuer, cantMintBlock1);
    await cantAssetCrawler1.crawl(bananode);

    expect(issuer).to.equal(cantAssetCrawler1.frontier.owner);
    expect("owned").to.equal(cantAssetCrawler1.frontier.state);
    expect("send#returned_to_sender").to.equal(cantAssetCrawler1.frontier.type);
    expect(cantAssetCrawler1.frontier.locked).to.equal(false);
    expect(cantAssetCrawler1.frontier.nanoBlock.hash).to.equal("B6B01C3701CFE5C091FB6DC068075D7A567926C74C44B1BC6F0FAE3BD18A0F6B");
  });

  it("cancels atomic swap if a block other than send#payment follows receive#atomic_swap", async () => {
    const issuer: TAccount = "ban_3cantszxkej3kzcjjpxcu35jcn6ck884uu3q8ypd3xc1e1y61tt6jj7p99yd";
    const cantMintBlock2 = await getBlock(bananode, issuer, "AE29A6AE92A3F78A49D6F1A82C014276FE95140963FCED2410A640A5173A1FC8");
    if (cantMintBlock2 === undefined) { throw 'undefined cantMintBlock2'; }
    const cantAssetCrawler2 = new AssetCrawler(issuer, cantMintBlock2);
    await cantAssetCrawler2.crawl(bananode);

    expect(issuer).to.equal(cantAssetCrawler2.frontier.owner);
    expect("owned").to.equal(cantAssetCrawler2.frontier.state);
    expect("send#returned_to_sender").to.equal(cantAssetCrawler2.frontier.type);
    expect(cantAssetCrawler2.frontier.locked).to.equal(false);
    expect(cantAssetCrawler2.frontier.nanoBlock.hash).to.equal("292A27AC9930DFAA00356AF1B78960A2FF785ABDD8999C2FB3D0F20C99A822A0");
  });

  it("cancels atomic swap if send#payment sends too little raw to the right account", async () => {
    const issuer: TAccount = "ban_3cantszxkej3kzcjjpxcu35jcn6ck884uu3q8ypd3xc1e1y61tt6jj7p99yd";
    const cantMintBlock3 = await getBlock(bananode, issuer, "B0BB1D5000D4A9E51993968C25A27804FC5551CFB18656B9FD7444D70C496A11");
    if (cantMintBlock3 === undefined) { throw 'undefined cantMintBlock3'; }
    const cantAssetCrawler3 = new AssetCrawler(issuer, cantMintBlock3);
    await cantAssetCrawler3.crawl(bananode);

    expect(issuer).to.equal(cantAssetCrawler3.frontier.owner);
    expect("owned").to.equal(cantAssetCrawler3.frontier.state);
    expect("send#returned_to_sender").to.equal(cantAssetCrawler3.frontier.type);
    expect(cantAssetCrawler3.frontier.locked).to.equal(false);
    expect(cantAssetCrawler3.frontier.nanoBlock.hash).to.equal("1ACDBFDF725D5738CD6B6454464FA1313574C056626ECEFCA8C4B5D564F75338");
  });

  it("cancels atomic swap if send#payment sends enough raw to the wrong account", async () => {
    const issuer: TAccount = "ban_3cantszxkej3kzcjjpxcu35jcn6ck884uu3q8ypd3xc1e1y61tt6jj7p99yd";
    const cantMintBlock4 = await getBlock(bananode, issuer, "32A3470B9217D796E16D2CE2445A5FC84F023695B099D2AE6B4B3133FF313CA6");
    if (cantMintBlock4 === undefined) { throw 'undefined cantMintBlock4'; }
    const cantAssetCrawler4 = new AssetCrawler(issuer, cantMintBlock4);
    await cantAssetCrawler4.crawl(bananode);

    expect(issuer).to.equal(cantAssetCrawler4.frontier.owner);
    expect("owned").to.equal(cantAssetCrawler4.frontier.state);
    expect("send#returned_to_sender").to.equal(cantAssetCrawler4.frontier.type);
    expect(cantAssetCrawler4.frontier.locked).to.equal(false);
    expect(cantAssetCrawler4.frontier.nanoBlock.hash).to.equal("A5FE789EF4C2E52EEFB31F3356581317FF5D1C8F9DEACDC4AE85EE8AB5D3E56A");
  });
});
