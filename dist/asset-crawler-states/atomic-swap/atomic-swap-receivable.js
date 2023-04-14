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
exports.atomicSwapReceivableCrawl = void 0;
var atomic_swap_1 = require("../../block-parsers/atomic-swap");
var find_block_at_height_and_previous_block_1 = require("../../lib/find-block-at-height-and-previous-block");
// State for when send#atomic_swap is confirmed and receive#atomic_swap is ready to be received but hasn't been confirmed yet.
function atomicSwapReceivableCrawl(nanoNode, assetCrawler) {
    return __awaiter(this, void 0, void 0, function () {
        var sendAtomicSwap, sendAtomicSwapHash, representative, atomicSwapConditions, payerAccount, originalOwner, prevAndNextBlockStatusReturn, prevAndNextBlock, previousBlock, receiveBlock, isReceive, receivesAtomicSwap, hasCorrectHeight, representativeUnchanged;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendAtomicSwap = assetCrawler.frontier;
                    sendAtomicSwapHash = sendAtomicSwap.block_hash;
                    representative = sendAtomicSwap.block_representative;
                    atomicSwapConditions = (0, atomic_swap_1.parseAtomicSwapRepresentative)(representative);
                    // guard
                    if (typeof atomicSwapConditions === 'undefined') {
                        return [2 /*return*/, { status: "error", error_type: "AtomicSwapError", message: "Unable to parse conditions for representative: ".concat(sendAtomicSwap.block_representative) }];
                    }
                    payerAccount = sendAtomicSwap.account;
                    originalOwner = sendAtomicSwap.owner;
                    // NB: Trace length from findBlockAtHeight might be significantly larger than 1.
                    assetCrawler.traceLength += BigInt(1);
                    return [4 /*yield*/, (0, find_block_at_height_and_previous_block_1.findBlockAtHeightAndPreviousBlock)(nanoNode, payerAccount, atomicSwapConditions.receiveHeight).catch(function (error) { throw (error); })];
                case 1:
                    prevAndNextBlockStatusReturn = _a.sent();
                    // guard
                    if (prevAndNextBlockStatusReturn.status === "error") {
                        return [2 /*return*/, prevAndNextBlockStatusReturn];
                    }
                    prevAndNextBlock = prevAndNextBlockStatusReturn.value;
                    previousBlock = prevAndNextBlock[0], receiveBlock = prevAndNextBlock[1];
                    if (previousBlock === undefined) {
                        return [2 /*return*/, { status: "error", error_type: "BlockNotFoundError", message: "Previous block is not found" }];
                    }
                    if (BigInt(previousBlock.balance) < atomicSwapConditions.minRaw) {
                        assetCrawler.assetChain.push({
                            state: "owned",
                            type: "send#returned_to_sender",
                            account: originalOwner,
                            owner: originalOwner,
                            locked: false,
                            traceLength: assetCrawler.traceLength,
                            block_link: sendAtomicSwap.block_link,
                            block_hash: sendAtomicSwap.block_hash,
                            block_height: sendAtomicSwap.block_height,
                            block_account: sendAtomicSwap.block_account,
                            block_representative: sendAtomicSwap.block_representative,
                            block_type: sendAtomicSwap.block_type,
                            block_subtype: sendAtomicSwap.block_subtype,
                            block_amount: sendAtomicSwap.block_amount
                        });
                        return [2 /*return*/, { status: "ok", value: true }];
                    }
                    // guard
                    if (receiveBlock === undefined) {
                        return [2 /*return*/, { status: "error", error_type: "BlockNotFoundError", message: "Receive block is not found" }];
                    }
                    isReceive = receiveBlock.subtype === 'receive';
                    receivesAtomicSwap = receiveBlock.link === sendAtomicSwapHash;
                    hasCorrectHeight = BigInt(receiveBlock.height) === atomicSwapConditions.receiveHeight;
                    representativeUnchanged = receiveBlock.representative == previousBlock.representative;
                    if (isReceive && receivesAtomicSwap && hasCorrectHeight && representativeUnchanged) {
                        assetCrawler.assetChain.push({
                            state: "atomic_swap_payable",
                            type: "receive#atomic_swap",
                            account: payerAccount,
                            owner: originalOwner,
                            locked: true,
                            traceLength: assetCrawler.traceLength,
                            block_link: receiveBlock.link,
                            block_hash: receiveBlock.hash,
                            block_height: receiveBlock.height,
                            block_account: receiveBlock.account,
                            block_representative: receiveBlock.representative,
                            block_type: receiveBlock.type,
                            block_subtype: receiveBlock.subtype,
                            block_amount: receiveBlock.amount
                        });
                        assetCrawler.head = receiveBlock.hash;
                        assetCrawler.headHeight = parseInt(receiveBlock.height);
                        return [2 /*return*/, {
                                status: 'ok',
                                value: true
                            }];
                    }
                    else {
                        // Atomic swap conditions were not met. Start chain from send#atomic_swap with new state.
                        assetCrawler.assetChain.push({
                            state: "(return_to_nft_seller)",
                            type: "receive#abort_receive_atomic_swap",
                            account: originalOwner,
                            owner: originalOwner,
                            locked: false,
                            traceLength: assetCrawler.traceLength,
                            block_link: receiveBlock.link,
                            block_hash: receiveBlock.hash,
                            block_height: receiveBlock.height,
                            block_account: receiveBlock.account,
                            block_representative: receiveBlock.representative,
                            block_type: receiveBlock.type,
                            block_subtype: receiveBlock.subtype,
                            block_amount: receiveBlock.amount
                        });
                        assetCrawler.assetChain.push({
                            state: 'owned',
                            type: 'send#returned_to_sender',
                            account: originalOwner,
                            owner: originalOwner,
                            locked: false,
                            traceLength: assetCrawler.traceLength,
                            block_link: sendAtomicSwap.block_link,
                            block_hash: sendAtomicSwap.block_hash,
                            block_height: sendAtomicSwap.block_height,
                            block_account: sendAtomicSwap.block_account,
                            block_representative: sendAtomicSwap.block_representative,
                            block_type: sendAtomicSwap.block_type,
                            block_subtype: sendAtomicSwap.block_subtype,
                            block_amount: sendAtomicSwap.block_amount
                        });
                        assetCrawler.head = sendAtomicSwap.block_hash;
                        assetCrawler.headHeight = parseInt(sendAtomicSwap.block_height);
                        return [2 /*return*/, {
                                status: 'ok',
                                value: true
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.atomicSwapReceivableCrawl = atomicSwapReceivableCrawl;
;
//# sourceMappingURL=atomic-swap-receivable.js.map