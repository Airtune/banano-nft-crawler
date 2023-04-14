import { IAssetBlock } from "../../src/interfaces/asset-block";

export const twosAssetChain: IAssetBlock[] = [
  {
    state: 'owned',
    type: 'change#mint',
    account: 'ban_1ty5s13h9tg9f57gwsto8njkzejfu9tjasc8a9mn1wujfxib8dj7w54jg3qm',
    owner: 'ban_1ty5s13h9tg9f57gwsto8njkzejfu9tjasc8a9mn1wujfxib8dj7w54jg3qm',
    locked: false,
    traceLength: BigInt(1),
    block_link: '0000000000000000000000000000000000000000000000000000000000000000',
    block_hash: 'F61CCF94D6E5CFE9601C436ACC3976AF876D1DA21909FEB88B629BEDEC4DF1EA',
    block_height: '3',
    block_account: undefined as any,
    block_representative: 'ban_159p616fwg36pynrh3i4b3p6qg4oxxxemypxgz6ubzid65kbcd4y4kpu5p6b',
    block_type: 'state',
    block_subtype: 'change',
    block_amount: undefined as any
  },
  {
    state: 'receivable',
    type: 'send#asset',
    account: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    owner: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    locked: false,
    traceLength: BigInt(2),
    block_link: '6B95C980CADCF922C08CBF43E73E30CCF2E15F2DA22858262D8EBA72B2915F3A',
    block_hash: 'F702530352E1DEC17FF2351E9F37BAB72D07EF3CB485AECD2C8721170CA206C7',
    block_height: '4',
    block_account: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    block_representative: 'ban_3xiwsycffsghx7i3riucsiwqfdw9fngt68abztwaprnuxqp6uwhckxu33ye7',
    block_type: 'state',
    block_subtype: 'send',
    block_amount: '1'
  },
  {
    state: 'owned',
    type: 'receive#asset',
    account: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    owner: 'ban_1twos81eoq9s6d1asht5wwz53m9kw7hkuajad1m4u5otgcsb4qstymquhahf',
    locked: false,
    traceLength: BigInt(3),
    block_link: 'F702530352E1DEC17FF2351E9F37BAB72D07EF3CB485AECD2C8721170CA206C7',
    block_hash: '201D206790E46B4CB24CA9F0DB370F8F4BA2E905D66E8DE825D36A9D0E775DAB',
    block_height: '1',
    block_account: 'ban_1ty5s13h9tg9f57gwsto8njkzejfu9tjasc8a9mn1wujfxib8dj7w54jg3qm',
    block_representative: 'ban_3catgir1p6b1edo5trp7fdb8gsxx4y5ffshbphj73zzy5hu678rsry7srh8b',
    block_type: 'state',
    block_subtype: 'receive',
    block_amount: '1'
  }
];
