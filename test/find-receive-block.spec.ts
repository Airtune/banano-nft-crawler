import { findReceiveBlock } from "../src/lib/find-receive-block";

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { bananode } from '../bananode';
import { MintBlocksCrawler } from "../src/mint-blocks-crawler";
import { INanoBlock, TAccount, TBlockHash } from 'nano-account-crawler/dist/nano-interfaces';
import { bananoIpfs } from "../src/lib/banano-ipfs";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('findReceiveBlock', function() {
  this.timeout(10000);

  it("unopened account doesn't throw an error", async () => {
    // Unopened account ban_3agsjomd4mo6amtsyizsbd8gkcgc7qkngmfpxk9iba9jjst7yomw9wu7bw51 that didn't receive send.
    // It's a random account so it may be received in the future leaving this test obsolete.
    const result = await findReceiveBlock(bananode, "ban_3srq97fkug3nn1noiwaogufoyo457cgewpatxierjusrjrho87rgwept9y1u", "1851B63D6382722268FC3FCB6C99BC26E7A994ABE9CEC637F8E873CC36D3B1FB", "ban_3agsjomd4mo6amtsyizsbd8gkcgc7qkngmfpxk9iba9jjst7yomw9wu7bw51").catch((error) => { throw(error); });
    expect(result.status === "error" || result.value?.receiveBlock === undefined).to.be.true;
  });

});
