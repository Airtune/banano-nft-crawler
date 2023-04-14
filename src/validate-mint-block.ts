const bananojs = require("@bananocoin/bananojs");
import { SUPPLY_HEX_PATTERN } from "./constants";
import { accountDataType } from "./account-data-type";
import { IMintBlock } from "./interfaces/mint-block";
import { TAccount } from "nano-account-crawler/dist/nano-interfaces";
import { IStatusReturn } from "nano-account-crawler/dist/status-return-interfaces";

function validateMintRepresentative(block: IMintBlock): IStatusReturn<void> {
  const representative = block.representative;
  const representativeType = accountDataType(representative);
  if (representativeType !== "unknown") {
    return {
      status: "error",
      error_type: "UnexpectedMintRepresentative",
      message: `Expected representative to encode IPFS CID. Got type: ${representativeType} for ${representative}`,
    };
  }
  const representativeHex = bananojs.getAccountPublicKey(representative);

  if (representativeHex.match(SUPPLY_HEX_PATTERN)) {
    return {
      status: "error",
      error_type: "MintBlockError",
      message: `Expected metadataRepresentative encoded from IPFS CID. Got nftSupplyRepresentative: ${representative}`,
    };
  }

  return {
    status: "ok",
    value: undefined,
  };
}

export function validateMintBlock(mintBlock: IMintBlock): IStatusReturn<void> {
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
          message: `Unexpected block subtype. Expected 'send' or 'change'. Got: '${mintBlock.subtype}' for block: ${mintBlock.hash}`,
        };
    
      default:
        return {
          status: "error",
          error_type: "MintBlockError",
          message: `Unknown block subtype. Expected 'send' or 'change'. Got: ${mintBlock.subtype} for block: ${mintBlock.hash}`,
        };
    }
  } else {
    return {
      status: "error",
      error_type: "MintBlockError",
      message: `Unexpected block type. Expected 'state'. Got: '${mintBlock.type}' for block: ${mintBlock.hash}`,
    };
  }
}
