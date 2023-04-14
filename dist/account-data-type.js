"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountDataType = void 0;
// src
var constants_1 = require("./constants");
var get_banano_account_public_key_1 = require("./lib/get-banano-account-public-key");
var accountDataType = function (account) {
    // Match against special case accounts
    if (account === constants_1.CANCEL_SUPPLY_REPRESENTATIVE) {
        return "cancel_supply_representative";
    }
    if (constants_1.BURN_ACCOUNTS.includes(account)) {
        return "burn";
    }
    // Match against hex patterns for encoded data.
    var publicKeyHex = (0, get_banano_account_public_key_1.getBananoAccountPublicKey)(account);
    if (publicKeyHex.match(constants_1.SUPPLY_HEX_PATTERN)) {
        return "supply";
    }
    if (publicKeyHex.match(constants_1.FINISH_SUPPLY_HEX_PATTERN)) {
        return "finish_supply";
    }
    if (publicKeyHex.match(constants_1.ATOMIC_SWAP_HEX_PATTERN)) {
        return "atomic_swap";
    }
    if (publicKeyHex.match(constants_1.ATOMIC_SWAP_DELEGATION_HEX_PATTERN)) {
        return "atomic_swap_delegation";
    }
    return "unknown";
};
exports.accountDataType = accountDataType;
//# sourceMappingURL=account-data-type.js.map