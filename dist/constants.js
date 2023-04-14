"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BURN_ACCOUNTS = exports.SEND_ALL_NFTS_REPRESENTATIVE = exports.CANCEL_SUPPLY_REPRESENTATIVE = exports.FINISH_SUPPLY_HEX_PATTERN = exports.FINISH_SUPPLY_HEX_HEADER = exports.SUPPLY_HEX_PATTERN = exports.SUPPLY_HEX_HEADER = exports.ATOMIC_SWAP_DELEGATION_HEX_PATTERN = exports.ATOMIC_SWAP_DELEGATION_HEADER = exports.ATOMIC_SWAP_HEX_PATTERN = exports.ATOMIC_SWAP_HEADER = exports.ADDRESS_PATTERN = exports.PRIVATE_KEY_PATTERN = exports.PUBLIC_KEY_PATTERN = exports.BLOCK_HASH_PATTERN = exports.HEX_PATTERN = exports.MAX_TRACE_LENGTH = exports.MAX_RPC_ITERATIONS = exports.META_PROTOCOL_SUPPORTED_VERSIONS = exports.META_PROTOCOL_VERSION = exports.META_PROTOCOL_PATCH = exports.META_PROTOCOL_MINOR = exports.META_PROTOCOL_MAJOR = void 0;
// Version for on-chain protocol
exports.META_PROTOCOL_MAJOR = BigInt('1');
exports.META_PROTOCOL_MINOR = BigInt('0');
exports.META_PROTOCOL_PATCH = BigInt('0');
exports.META_PROTOCOL_VERSION = "".concat(exports.META_PROTOCOL_MAJOR, ".").concat(exports.META_PROTOCOL_MINOR, ".").concat(exports.META_PROTOCOL_PATCH);
exports.META_PROTOCOL_SUPPORTED_VERSIONS = ["1.0.0"];
// Settings
exports.MAX_RPC_ITERATIONS = 1000; // Max number of node RPC calls allowed to trace one NFT in a single request
exports.MAX_TRACE_LENGTH = BigInt(690000); // Trace length is an arbitrary mix of block counts and RPC call counts.
// Patterns
exports.HEX_PATTERN = /^[0-9A-F]+$/i;
exports.BLOCK_HASH_PATTERN = /^[0-9A-F]{64}$/i;
exports.PUBLIC_KEY_PATTERN = /^[0-9A-F]{64}$/i;
exports.PRIVATE_KEY_PATTERN = /^[0-9A-F]{64}$/i;
exports.ADDRESS_PATTERN = /^ban_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/;
// https://github.com/Airtune/73-meta-tokens/blob/main/meta_ledger_protocol/atomic_swap.md
exports.ATOMIC_SWAP_HEADER = "23559C159E22C"; // must be 13 chars
exports.ATOMIC_SWAP_HEX_PATTERN = RegExp("^".concat(exports.ATOMIC_SWAP_HEADER, "(?<assetHeight>[0-9A-F]{10})(?<receiveHeight>[0-9A-F]{10})(?<minRaw>[0-9A-F]{31})$"), "i");
exports.ATOMIC_SWAP_DELEGATION_HEADER = "A3559C159E22C"; // must be 13 chars
exports.ATOMIC_SWAP_DELEGATION_HEX_PATTERN = RegExp("^".concat(exports.ATOMIC_SWAP_DELEGATION_HEADER, "(?<assetHeight>[0-9A-F]{10})(?<receiveHeight>[0-9A-F]{10})(?<minRaw>[0-9A-F]{31})$"), "i");
// https://github.com/Airtune/73-meta-tokens/blob/main/meta_ledger_protocol/supply_block.md
exports.SUPPLY_HEX_HEADER = "51BACEED6078000000"; // must be 18 char hex
exports.SUPPLY_HEX_PATTERN = RegExp("^".concat(exports.SUPPLY_HEX_HEADER, "(?<major>[0-9A-F]{10})(?<minor>[0-9A-F]{10})(?<patch>[0-9A-F]{10})(?<maxSupply>[0-9A-F]{16})$"), "i");
exports.FINISH_SUPPLY_HEX_HEADER = "3614865E0051BA0033BB581E"; // must be 24 char hex
exports.FINISH_SUPPLY_HEX_PATTERN = RegExp("^".concat(exports.FINISH_SUPPLY_HEX_HEADER, "(?<supplyBlockHeight>[0-9A-F]{40})$"), "i");
// Representative used to cancel NFT supply block with a change block in place of the first mint block.
exports.CANCEL_SUPPLY_REPRESENTATIVE = 'ban_1nftsupp1ycance1111oops1111that1111was1111my1111bad1hq5sjhey';
exports.SEND_ALL_NFTS_REPRESENTATIVE = 'ban_1senda11nfts1111111111111111111111111111111111111111rtbtxits';
exports.BURN_ACCOUNTS = [
    "ban_1burnbabyburndiscoinferno111111111111111111111111111aj49sw3w",
    "ban_1uo1cano1bot1a1pha1616161616161616161616161616161616p3s5tifp",
    "ban_1ban116su1fur16uo1cano16su1fur16161616161616161616166a1sf7xw",
    "ban_1111111111111111111111111111111111111111111111111111hifc8npp" // nano burn account
];
// Validators
if (typeof exports.ATOMIC_SWAP_HEADER !== "string" || exports.ATOMIC_SWAP_HEADER.length !== 13 || !exports.ATOMIC_SWAP_HEADER.match(exports.HEX_PATTERN)) {
    throw Error("ATOMIC_SWAP_HEADER must be 13 char hex");
}
if (typeof exports.SUPPLY_HEX_HEADER !== "string" || exports.SUPPLY_HEX_HEADER.length !== 18 || !exports.SUPPLY_HEX_HEADER.match(exports.HEX_PATTERN)) {
    throw Error("SUPPLY_HEX_HEADER must be 18 char hex");
}
if (typeof exports.FINISH_SUPPLY_HEX_HEADER !== "string" || exports.FINISH_SUPPLY_HEX_HEADER.length !== 24 || !exports.FINISH_SUPPLY_HEX_HEADER.match(exports.HEX_PATTERN)) {
    throw Error("SUPPLY_HEX_HEADER must be 24 char hex");
}
if (typeof exports.CANCEL_SUPPLY_REPRESENTATIVE !== "string" || !exports.CANCEL_SUPPLY_REPRESENTATIVE.match(exports.ADDRESS_PATTERN)) {
    throw Error("CANCEL_SUPPLY_REPRESENTATIVE must be a valid Banano address");
}
var bananojs = require("@bananocoin/bananojs");
// throws error on invalid checksum
bananojs.getAccountPublicKey(exports.CANCEL_SUPPLY_REPRESENTATIVE);
bananojs.getAccountPublicKey(exports.SEND_ALL_NFTS_REPRESENTATIVE);
for (var i = 0; i < exports.BURN_ACCOUNTS.length; i++) {
    var burnAccount = exports.BURN_ACCOUNTS[i];
    bananojs.getAccountPublicKey(burnAccount);
}
//# sourceMappingURL=constants.js.map