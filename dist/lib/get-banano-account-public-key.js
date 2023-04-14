"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBananoAccountPublicKey = void 0;
var bananojs = require("@bananocoin/bananojs");
var getBananoAccountPublicKey = function (account) {
    return bananojs.getAccountPublicKey(account);
};
exports.getBananoAccountPublicKey = getBananoAccountPublicKey;
//# sourceMappingURL=get-banano-account-public-key.js.map