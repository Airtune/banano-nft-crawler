import { IAssetBlock } from "../../src/interfaces/asset-block";

export const twosAssetChain: IAssetBlock[] = [
  {
    state: 'owned',
    type: 'change#mint',
    account: 'ban_1ty5s13h9tg9f57gwsto8njkzejfu9tjasc8a9mn1wujfxib8dj7w54jg3qm',
    owner: 'ban_1ty5s13h9tg9f57gwsto8njkzejfu9tjasc8a9mn1wujfxib8dj7w54jg3qm',
    locked: false,
    nanoBlock: {
      type: 'state',
      representative: 'ban_159p616fwg36pynrh3i4b3p6qg4oxxxemypxgz6ubzid65kbcd4y4kpu5p6b',
      link: '0000000000000000000000000000000000000000000000000000000000000000',
      balance: '19',
      balance_decimal: '0.00000000000000000000000000019',
      previous: 'EA573D9E77B0BC468BEEDD2F8B1A4E8C2864C016572B2EC4AF0C37916875458A',
      subtype: 'change',
      local_timestamp: '1648561914',
      height: '3',
      hash: 'F61CCF94D6E5CFE9601C436ACC3976AF876D1DA21909FEB88B629BEDEC4DF1EA',
      confirmed: 'true',
      work: '31a8010100000000',
      signature: 'CE1EF238BBDCBBFB488A6337257EC536E5115A135E986415E8DAB5CF38C1BBEBDF82B9E1AC7A44A0FADABBCB8D108C893A325334F13268D17E7DD72CBF2FAC03'
    } as any,
    traceLength: BigInt(1)
  },
  {
    state: 'receivable',
    type: 'send#asset',
    account: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    owner: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    locked: false,
    nanoBlock: {
      type: 'state',
      representative: 'ban_3xiwsycffsghx7i3riucsiwqfdw9fngt68abztwaprnuxqp6uwhckxu33ye7',
      link: '6B95C980CADCF922C08CBF43E73E30CCF2E15F2DA22858262D8EBA72B2915F3A',
      balance: '18',
      balance_decimal: '0.00000000000000000000000000018',
      previous: 'F61CCF94D6E5CFE9601C436ACC3976AF876D1DA21909FEB88B629BEDEC4DF1EA',
      subtype: 'send',
      account: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
      amount: '1',
      amount_decimal: '0.00000000000000000000000000001',
      local_timestamp: '1648562358',
      height: '4',
      hash: 'F702530352E1DEC17FF2351E9F37BAB72D07EF3CB485AECD2C8721170CA206C7',
      confirmed: 'true',
      work: '7fc9850000000000',
      signature: 'A978DD5238796EDC76B69FDDEE5F4F146DCAC1A917E9871CE8A1909D4ECEA2B5BF5D5777EDAEE870CB24C5A904976D260ADC795E85D7E516BE1E5385F007F306'
    } as any,
    traceLength: BigInt(2)
  },
  {
    state: 'owned',
    type: 'receive#asset',
    account: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    owner: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    locked: false,
    nanoBlock: {
      type: 'state',
      representative: 'ban_3catgir1p6b1edo5trp7fdb8gsxx4y5ffshbphj73zzy5hu678rsry7srh8b',
      link: 'F702530352E1DEC17FF2351E9F37BAB72D07EF3CB485AECD2C8721170CA206C7',
      balance: '1',
      balance_decimal: '0.00000000000000000000000000001',
      previous: '0000000000000000000000000000000000000000000000000000000000000000',
      subtype: 'receive',
      account: 'ban_1ty5s13h9tg9f57gwsto8njkzejfu9tjasc8a9mn1wujfxib8dj7w54jg3qm',
      amount: '1',
      amount_decimal: '0.00000000000000000000000000001',
      local_timestamp: '1648562372',
      height: '1',
      hash: '201D206790E46B4CB24CA9F0DB370F8F4BA2E905D66E8DE825D36A9D0E775DAB',
      confirmed: 'true',
      work: '1e4b110000000000',
      signature: '3E73873245DC47A4D0F41725A096C02D1B213FC1ED2B44F3CAB16424BFA884AEF75A4133DBB63CA9FED3CEA04D378CA2CE2CCBE231D52A2A90F95EC5CDD5160D'
    } as any,
    traceLength: BigInt(3)
  }
];
