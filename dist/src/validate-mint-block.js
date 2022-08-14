"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMintBlock = void 0;
var bananojs = require("@bananocoin/bananojs");
var constants_1 = require("./constants");
var account_data_type_1 = require("./account-data-type");
function validateMintRepresentative(block) {
    var representative = block.representative;
    var representativeType = account_data_type_1.accountDataType(representative);
    if (representativeType !== "unknown") {
        throw Error("UnexpectedMintRepresentative: Expected representative to encode IPFS CID. Got type: " + representativeType + " for " + representative);
    }
    var representativeHex = bananojs.getAccountPublicKey(representative);
    if (representativeHex.match(constants_1.SUPPLY_HEX_PATTERN)) {
        throw Error("MintBlockError: Expected metadataRepresentative encoded from IPFS CID. Got nftSupplyRepresentative: " + representative);
    }
}
function validateMintBlock(mintBlock) {
    if (mintBlock.type === 'state') {
        switch (mintBlock.subtype) {
            case 'send':
                validateMintRepresentative(mintBlock);
                break;
            case 'change':
                validateMintRepresentative(mintBlock);
                break;
            case 'open':
            case 'receive':
            case 'epoch':
                throw Error("MintBlockError: Unexpected block subtype. Expected 'send' or 'change'. Got: '" + mintBlock.subtype + "' for block: " + mintBlock.hash);
            default:
                throw Error("MintBlockError: Unknown block subtype. Expected 'send' or 'change'. Got: " + mintBlock.subtype + " for block: " + mintBlock.hash);
        }
    }
    else {
        throw Error("MintBlockError: Unexpected block type. Expected 'state'. Got: '" + mintBlock.type + "' for block: " + mintBlock.hash);
    }
}
exports.validateMintBlock = validateMintBlock;
//# sourceMappingURL=validate-mint-block.js.map