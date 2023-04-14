"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bananoIpfs = void 0;
var bananojs = require("@bananocoin/bananojs");
var nano_ipfs_1 = require("nano-ipfs");
var publicKeyToAccount = function (publicKey) {
    return bananojs.bananoUtil.getAccount(publicKey, 'ban_');
};
var accountToPublicKey = bananojs.bananoUtil.getAccountPublicKey;
exports.bananoIpfs = new nano_ipfs_1.NanoIpfs(publicKeyToAccount, accountToPublicKey);
//# sourceMappingURL=banano-ipfs.js.map