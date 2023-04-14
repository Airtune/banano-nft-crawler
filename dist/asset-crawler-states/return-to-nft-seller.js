"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnToNFTSellerCrawl = void 0;
function returnToNFTSellerCrawl(_nanoNode, assetCrawler) {
    return __awaiter(this, void 0, void 0, function () {
        var assetChain, sendAtomicSwapBlockStatusReturn, sendAtomicSwapBlock, frontier;
        return __generator(this, function (_a) {
            assetChain = assetCrawler.assetChain;
            sendAtomicSwapBlockStatusReturn = _findSenderBlock(assetChain);
            if (sendAtomicSwapBlockStatusReturn.status === "error") {
                return [2 /*return*/, sendAtomicSwapBlockStatusReturn];
            }
            sendAtomicSwapBlock = sendAtomicSwapBlockStatusReturn.value;
            frontier = {
                state: "owned",
                type: "send#returned_to_sender",
                account: sendAtomicSwapBlock.account,
                owner: sendAtomicSwapBlock.account,
                locked: false,
                traceLength: assetCrawler.traceLength,
                block_link: sendAtomicSwapBlock.block_link,
                block_hash: sendAtomicSwapBlock.block_hash,
                block_height: sendAtomicSwapBlock.block_height,
                block_account: sendAtomicSwapBlock.block_account,
                block_representative: sendAtomicSwapBlock.block_representative,
                block_type: sendAtomicSwapBlock.block_type,
                block_subtype: sendAtomicSwapBlock.block_subtype,
                block_amount: sendAtomicSwapBlock.block_amount
            };
            assetCrawler.assetChain.push(frontier);
            assetCrawler.head = sendAtomicSwapBlock.block_hash;
            assetCrawler.headHeight = parseInt(sendAtomicSwapBlock.block_height);
            return [2 /*return*/, { status: "ok", value: true }];
        });
    });
}
exports.returnToNFTSellerCrawl = returnToNFTSellerCrawl;
function _findSenderBlock(assetChain) {
    for (var i = assetChain.length - 1; i >= 0; i--) {
        var block = assetChain[i];
        if (["atomic_swap_receivable"].includes(block.state)) {
            return { status: "ok", value: block };
        }
    }
    return {
        status: "error",
        error_type: "UnableToFindBlock",
        message: "Unable to find atomic_swap_receivable for asset: ".concat(assetChain[0].block_hash)
    };
}
//# sourceMappingURL=return-to-nft-seller.js.map