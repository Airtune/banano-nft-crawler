import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { INanoBlock, TBlockHash } from 'nano-account-crawler/dist/nano-interfaces';
import { bananode } from '../bananode';
import { SupplyBlocksCrawler } from '../src/supply-blocks-crawler';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('SupplyBlocksCrawler', function() {
  this.timeout(10000);
  let supplyBlocksCrawler1sux: SupplyBlocksCrawler;
  let supplyBlocks1sux: INanoBlock[];
  let supplyBlockHashes1sux: TBlockHash[];

  let supplyBlocksCrawlerMinter: SupplyBlocksCrawler;
  let supplyBlocksMinter: INanoBlock[];
  let supplyBlockHashesMinter: TBlockHash[];


  before("run supplyBlocksCrawler", async () => {
    supplyBlocksCrawler1sux = new SupplyBlocksCrawler("ban_1sux9e4wz3drie3csujan6fkdqoi7otumxkcy4gnh4tz1dihp4j7bx46uoes");
    supplyBlocks1sux = await supplyBlocksCrawler1sux.crawl(bananode).catch((error) => { throw(error) });
    supplyBlockHashes1sux = supplyBlocks1sux.map((supplyBlock) => { return supplyBlock.hash; });

    supplyBlocksCrawlerMinter = new SupplyBlocksCrawler("ban_3mint9uhtn84io1817o7qnxnm1outy7oas3b6b5upg91mw3oghzctpeeqa17");
    supplyBlocksMinter = await supplyBlocksCrawlerMinter.crawl(bananode).catch((error) => { throw(error) });
    supplyBlockHashesMinter = supplyBlocksMinter.map((supplyBlock) => { return supplyBlock.hash; });
  });

  it("correctly offsets head 1 back if head has a supply representative when calling crawl for the second time with new account history");

  it("crawl partial account history from head height 6", async () => {
    const supplyBlocksCrawlerPartial = new SupplyBlocksCrawler("ban_3mint9uhtn84io1817o7qnxnm1outy7oas3b6b5upg91mw3oghzctpeeqa17", "961A2E9FBD620E3FF9AAF4CF377D424A42069A5F19110543A432786CC48F7E18", "0");
    const supplyBlocksPartial = await supplyBlocksCrawlerPartial.crawl(bananode).catch((error) => { throw(error) });
    const supplyBlockHashesPartial = supplyBlocksPartial.map((supplyBlock) => { return supplyBlock.hash; });

    expect(supplyBlockHashesPartial.length).to.equal(2);
    expect(supplyBlockHashesPartial[0]).to.equal(supplyBlockHashesMinter[2]);
    expect(supplyBlockHashesPartial[1]).to.equal(supplyBlockHashesMinter[3]);
  });

  it("crawl partial account history from head height 5", async () => {
    const supplyBlocksCrawlerPartial = new SupplyBlocksCrawler("ban_3mint9uhtn84io1817o7qnxnm1outy7oas3b6b5upg91mw3oghzctpeeqa17", "2B1C66889A476CE2AABCBC56483B3E7027A43179DBE123225204BCCE02D52115", "0");
    const supplyBlocksPartial = await supplyBlocksCrawlerPartial.crawl(bananode).catch((error) => { throw(error) });
    const supplyBlockHashesPartial = supplyBlocksPartial.map((supplyBlock) => { return supplyBlock.hash; });

    expect(supplyBlockHashesPartial.length).to.equal(3);
    expect(supplyBlockHashesPartial[0]).to.equal(supplyBlockHashesMinter[1]);
    expect(supplyBlockHashesPartial[1]).to.equal(supplyBlockHashesMinter[2]);
    expect(supplyBlockHashesPartial[2]).to.equal(supplyBlockHashesMinter[3]);
  });
  
  it("registers change#supply blocks followed by a valid mint block", async () => {
    // IPFS CID: QmaP8dJDpmft1B9GnWMH7qyLh2uRfzAFjU7FNc7SmWK1pG
    expect(supplyBlockHashes1sux).to.include("2999304B6327A0A0A1F81BFE601477A351E2D9EE73F1F6EAF5719F25A7DB2A51");
  });

  it("registers change#supply blocks when starting from the latest supply block despite being invalid when existing metadata representatives are not ignored", async () => {
    // IPFS CID: QmaP8dJDpmft1B9GnWMH7qyLh2uRfzAFjU7FNc7SmWK1pG
    const partialSupplyBlocksCrawler = new SupplyBlocksCrawler("ban_1sux9e4wz3drie3csujan6fkdqoi7otumxkcy4gnh4tz1dihp4j7bx46uoes", "2999304B6327A0A0A1F81BFE601477A351E2D9EE73F1F6EAF5719F25A7DB2A51", "1");
    // manually add existing metadataRepresentatives
    const partialSupplyBlocks = await partialSupplyBlocksCrawler.crawl(bananode).catch((error) => { throw(error) });
    const partialSupplyBlockHashes = partialSupplyBlocks.map((supplyBlock) => { return supplyBlock.hash; });
    expect(partialSupplyBlockHashes).to.include("B64219CA78D3DFE7E5A2770340AABA4B2DBDA367180B21D416EC13D7FC02F11D");
  });

  it("doesn't register past or invalid change#supply blocks when starting from the latest supply block with existing metadata representatives ignored", async () => {
    // IPFS CID: QmaP8dJDpmft1B9GnWMH7qyLh2uRfzAFjU7FNc7SmWK1pG
    const partialSupplyBlocksCrawler = new SupplyBlocksCrawler("ban_1sux9e4wz3drie3csujan6fkdqoi7otumxkcy4gnh4tz1dihp4j7bx46uoes", "2999304B6327A0A0A1F81BFE601477A351E2D9EE73F1F6EAF5719F25A7DB2A51", "1");
    // manually add existing metadataRepresentatives
    partialSupplyBlocksCrawler.ignoreMetadataRepresentatives = ['ban_3eqgz3zg96g4kfm6qc549sh9zgeimg4y71s787dy54z788td651onqz3wmdj'];
    const partialSupplyBlocks = await partialSupplyBlocksCrawler.crawl(bananode).catch((error) => { throw(error) });
    const partialSupplyBlockHashes = partialSupplyBlocks.map((supplyBlock) => { return supplyBlock.hash; });
    expect(partialSupplyBlockHashes).to.not.include("2999304B6327A0A0A1F81BFE601477A351E2D9EE73F1F6EAF5719F25A7DB2A51");
    expect(partialSupplyBlockHashes).to.be.empty;
  });

  it("doesn't register a supply block if it's the frontier block of an account", async () => {
    const supplyBlocksCrawler = new SupplyBlocksCrawler("ban_11nriprqsrt3tag5h1t81s1588noncoseusmuda79u3pcrbydeobtsxun1r1");
    const supplyBlock: INanoBlock[] = await supplyBlocksCrawler.crawl(bananode).catch((error) => { throw(error) });
    const supplyBlocksHashes: TBlockHash[] = supplyBlock.map((supplyBlock) => { return supplyBlock.hash; });
    expect(supplyBlocksHashes).to.not.include("4837E7DF43A8B8C8507411E575A5421BFC7D1707F0860129B6A09BF6BF8ABAB5");
  });

  it("doesn't detect change#supply block with supported meta protocol v1.0.0 followed by change#supply block", async () => {
    expect(supplyBlockHashes1sux).to.not.include("E8AE3558F4AF0F02492D27226A8D20AEF1131E0EF0D397407534D3FE3FFDB6CC");
  });

  it("doesn't detect change#supply block with unsupported meta protocol v0.0.0 followed by change#supply block", async () => {
    expect(supplyBlockHashes1sux).to.not.include("1B78DA35BE3911D1C00C11E0D2F66E21458DAD7BD912F613B90126FDBB54A82B");
  });

  it("doesn't detect change#supply block with unsupported meta protocol v0.0.0 followed by change#mint block", async () => {
    expect(supplyBlockHashes1sux).to.not.include("EBC92C6A42AB430051AF13EE830DBB07BB6F3F864621F5AC1A952BD16C5B3AF6");
  });

  it("doesn't detect change#supply blocks that doesn't match the header exactly", async () => {
    // Header incorrectly set to "51BACEED607800000F" / "ban_1nftsupp1y11119"
    expect(supplyBlockHashes1sux).to.not.include("9649A724FCC22B1763F8AE043A4FA092218746191C5FD9EDE280A96CFBEB7815");
  });

  it("doesn't register a send block with a supply representative as a valid supply block", async () => {
    expect(supplyBlockHashes1sux).to.not.include("022A63931EF16F7F632B89D0708915CE99919BE4CAFFDBCC57B146949016D051");
  });

  it("doesn't register a receive block with a supply representative as a valid supply block", async () => {
    expect(supplyBlockHashes1sux).to.not.include("BCDA36168EEB0FC641B5E3F05A70F453AA528561EA74505202C87A959EDEC128");
  });

  it("cancels change#supply block if it's followed by a block with a cancel_supply_representative", async () => {
    expect(supplyBlockHashes1sux).to.not.include("4A7D514A2E8B2690A9C8CFDBE44E492952086106157C9600800CCEF051E96372");
  });

  it("cancels change#supply block if it's followed by a block with the finish_supply_representative header", async () => {
    expect(supplyBlockHashes1sux).to.not.include("221902F22014B1ED5115BC7E0731FED3729241D65AD1A77616F5498E14BB9053");
  });

  it("cancels change#supply block if it's followed by a block with the atomic_swap_representative header", async () => {
    expect(supplyBlockHashes1sux).to.not.include("7A3AD4F644C6935933C11E09D2A40C99E71816EB286217E3B0A7A00FF0030095");
  });

  it("cancels change#supply block if it's followed by a block with a burn account as representative", async () => {
    // followed by change rep to ban_1burnbabyburndiscoinferno111111111111111111111111111aj49sw3w
    expect(supplyBlockHashes1sux).to.not.include("8624383732901D19C6710576679BD9A851E1895201F5A2246561607E7A206F73");
    // followed by change rep to ban_1uo1cano1bot1a1pha1616161616161616161616161616161616p3s5tifp
    expect(supplyBlockHashes1sux).to.not.include("FF7587D932692178FFEC2BDE17ABBE2B5FE527CD1F63894B8E3A0174AC9DC125");
    // followed by change rep to ban_1ban116su1fur16uo1cano16su1fur16161616161616161616166a1sf7xw
    expect(supplyBlockHashes1sux).to.not.include("5D9E077E0D0309323882443942F6C317B9CD2391E80C852498E97A4E57EC5492");
    // followed by change rep to ban_1111111111111111111111111111111111111111111111111111hifc8npp
    expect(supplyBlockHashes1sux).to.not.include("E93AE0F5EDDB957CCE0065A184987C98623AAB2419AC517503190DBF949E9A4F");
  });

  it("ignores supply blocks for already initialized metadata representatives", async () => {
    // IPFS CID: QmaP8dJDpmft1B9GnWMH7qyLh2uRfzAFjU7FNc7SmWK1pG
    // Corresponding Metadata Representative: ban_3eqgz3zg96g4kfm6qc549sh9zgeimg4y71s787dy54z788td651onqz3wmdj
    // Already used earlier: E415CF08B08111939C9E896F574F99F22E1A1E873504724EB17DFB9B7CA986B1
    expect(supplyBlockHashes1sux).to.not.include("B64219CA78D3DFE7E5A2770340AABA4B2DBDA367180B21D416EC13D7FC02F11D");
  });
});
