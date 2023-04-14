"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMintBlock = void 0;
var bananojs = require("@bananocoin/bananojs");
var constants_1 = require("./constants");
var account_data_type_1 = require("./account-data-type");
function validateMintRepresentative(block) {
    var representative = block.representative;
    var representativeType = (0, account_data_type_1.accountDataType)(representative);
    if (representativeType !== "unknown") {
        return {
            status: "error",
            error_type: "UnexpectedMintRepresentative",
            message: "Expected representative to encode IPFS CID. Got type: ".concat(representativeType, " for ").concat(representative),
        };
    }
    var representativeHex = bananojs.getAccountPublicKey(representative);
    if (representativeHex.match(constants_1.SUPPLY_HEX_PATTERN)) {
        return {
            status: "error",
            error_type: "MintBlockError",
            message: "Expected metadataRepresentative encoded from IPFS CID. Got nftSupplyRepresentative: ".concat(representative),
        };
    }
    return {
        status: "ok",
        value: undefined,
    };
}
function validateMintBlock(mintBlock) {
    if (mintBlock.type === 'state') {
        switch (mintBlock.subtype) {
            case 'send':
                return validateMintRepresentative(mintBlock);
            case 'change':
                return validateMintRepresentative(mintBlock);
            case 'open':
            case 'receive':
            case 'epoch':
                return {
                    status: "error",
                    error_type: "MintBlockError",
                    message: "Unexpected block subtype. Expected 'send' or 'change'. Got: '".concat(mintBlock.subtype, "' for block: ").concat(mintBlock.hash),
                };
            default:
                return {
                    status: "error",
                    error_type: "MintBlockError",
                    message: "Unknown block subtype. Expected 'send' or 'change'. Got: ".concat(mintBlock.subtype, " for block: ").concat(mintBlock.hash),
                };
        }
    }
    else {
        return {
            status: "error",
            error_type: "MintBlockError",
            message: "Unexpected block type. Expected 'state'. Got: '".concat(mintBlock.type, "' for block: ").concat(mintBlock.hash),
        };
    }
}
exports.validateMintBlock = validateMintBlock;
//# sourceMappingURL=validate-mint-block.js.map