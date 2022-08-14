"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFinishSupplyRepresentative = exports.parseSupplyRepresentative = void 0;
var constants_1 = require("../constants");
var get_banano_account_public_key_1 = require("../lib/get-banano-account-public-key");
function parseSupplyRepresentative(representative) {
    var supplyHex = get_banano_account_public_key_1.getBananoAccountPublicKey(representative);
    var match = supplyHex.match(constants_1.SUPPLY_HEX_PATTERN);
    if (!match) {
        return undefined;
    }
    var major = BigInt("0x" + match.groups.major).toString(10);
    var minor = BigInt("0x" + match.groups.minor).toString(10);
    var patch = BigInt("0x" + match.groups.patch).toString(10);
    var version = major + "." + minor + "." + patch;
    var maxSupply = BigInt("0x" + match.groups.maxSupply);
    return {
        version: version,
        maxSupply: maxSupply
    };
}
exports.parseSupplyRepresentative = parseSupplyRepresentative;
function parseFinishSupplyRepresentative(representative) {
    var finishSupplyHex = get_banano_account_public_key_1.getBananoAccountPublicKey(representative);
    var match = finishSupplyHex.match(constants_1.FINISH_SUPPLY_HEX_PATTERN);
    if (!match) {
        return undefined;
    }
    return { supplyBlockHeight: BigInt("0x" + match.groups.supplyBlockHeight) };
}
exports.parseFinishSupplyRepresentative = parseFinishSupplyRepresentative;
//# sourceMappingURL=supply.js.map