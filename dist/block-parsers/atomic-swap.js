"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAtomicSwapRepresentative = void 0;
var constants_1 = require("../constants");
var get_banano_account_public_key_1 = require("../lib/get-banano-account-public-key");
function parseAtomicSwapRepresentative(representative, delegation) {
    if (delegation === void 0) { delegation = false; }
    var atomicSwapHex = (0, get_banano_account_public_key_1.getBananoAccountPublicKey)(representative);
    var hexPattern = delegation ? constants_1.ATOMIC_SWAP_DELEGATION_HEX_PATTERN : constants_1.ATOMIC_SWAP_HEX_PATTERN;
    var match = atomicSwapHex.match(hexPattern);
    if (match) {
        return {
            assetHeight: BigInt("0x".concat(match.groups.assetHeight)),
            receiveHeight: BigInt("0x".concat(match.groups.receiveHeight)),
            minRaw: BigInt("0x".concat(match.groups.minRaw))
        };
    }
    else {
        return undefined;
    }
}
exports.parseAtomicSwapRepresentative = parseAtomicSwapRepresentative;
//# sourceMappingURL=atomic-swap.js.map