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
exports.atomicSwapPayableCrawl = void 0;
var find_block_at_height_and_previous_block_1 = require("../../lib/find-block-at-height-and-previous-block");
function validPayment(previousBlock, nextBlock, sendAtomicSwap, atomicSwapConditions) {
    if (nextBlock.subtype !== 'send') {
        return false;
    }
    var payedEnough = BigInt(nextBlock.amount) >= atomicSwapConditions.minRaw;
    var payedCorrectAccount = nextBlock.account === sendAtomicSwap.owner;
    var representativeUnchanged = nextBlock.representative === previousBlock.representative;
    return payedEnough && payedCorrectAccount && representativeUnchanged;
}
// State for when receive#atomic_swap is confirmed but send#payment hasn't been sent yet.
function atomicSwapPayableCrawl(nanoNode, assetCrawler) {
    return __awaiter(this, void 0, void 0, function () {
        var payingAccount, paymentHeight, prevAndNextBlockStatusReturn, prevAndNextBlock, previousBlock, nextBlock, sendAtomicSwap, atomicSwapConditions, originalOwner, type;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payingAccount = assetCrawler.frontier.account;
                    paymentHeight = BigInt(assetCrawler.frontier.block_height) + BigInt(1);
                    return [4 /*yield*/, (0, find_block_at_height_and_previous_block_1.findBlockAtHeightAndPreviousBlock)(nanoNode, payingAccount, paymentHeight).catch(function (error) { throw (error); })];
                case 1:
                    prevAndNextBlockStatusReturn = _a.sent();
                    // guard
                    if (prevAndNextBlockStatusReturn.status === "error") {
                        return [2 /*return*/, prevAndNextBlockStatusReturn];
                    }
                    prevAndNextBlock = prevAndNextBlockStatusReturn.value;
                    previousBlock = prevAndNextBlock[0], nextBlock = prevAndNextBlock[1];
                    // Guard. Should not happen since this point shouldn't be reached for unopened accounts given
                    // the users followed client protocol and checked that the account was opened before initiating a swap.
                    if (prevAndNextBlock == undefined) {
                        return [2 /*return*/, { status: "error", error_type: 'UnexpectedMetaChain', message: 'Account was not opened before initiating a swap.' }];
                    }
                    sendAtomicSwap = assetCrawler.findSendAtomicSwapBlock();
                    // guards
                    if (nextBlock === undefined || sendAtomicSwap === undefined) {
                        return [2 /*return*/, { status: "error", error_type: 'UnexpectedMetaChain', message: 'nextBlock or sendAtomicSwap is undefined.' }];
                    }
                    if (sendAtomicSwap.state !== 'atomic_swap_receivable') {
                        return [2 /*return*/, { status: "error", error_type: 'UnexpectedMetaChain', message: "Expected states of the chain to be pending_atomic_swap -> pending_payment -> ... Got: ".concat(sendAtomicSwap.state, " -> ").concat(assetCrawler.frontier.state, " -> ...") }];
                    }
                    // NB: Trace length from findBlockAtHeight might be significantly larger than 1.
                    assetCrawler.traceLength += BigInt("1");
                    atomicSwapConditions = assetCrawler.currentAtomicSwapConditions();
                    originalOwner = sendAtomicSwap.owner;
                    if (validPayment(previousBlock, nextBlock, sendAtomicSwap, atomicSwapConditions)) {
                        assetCrawler.assetChain.push({
                            state: 'owned',
                            type: 'send#payment',
                            account: payingAccount,
                            owner: payingAccount,
                            locked: false,
                            traceLength: assetCrawler.traceLength,
                            block_link: nextBlock.link,
                            block_hash: nextBlock.hash,
                            block_height: nextBlock.height,
                            block_account: payingAccount,
                            block_representative: nextBlock.representative,
                            block_type: nextBlock.type,
                            block_subtype: nextBlock.subtype,
                            block_amount: nextBlock.amount
                        });
                        assetCrawler.head = nextBlock.hash;
                        assetCrawler.headHeight = parseInt(nextBlock.height);
                    }
                    else {
                        type = void 0;
                        switch (nextBlock.subtype) {
                            case "send":
                            case "receive":
                            case "change":
                                type = "".concat(nextBlock.subtype, "#abort_payment");
                                break;
                            default:
                                return [2 /*return*/, { status: "error", error_type: 'UnexpectedBlockSubtype', message: "Pending atomic swap got unexpected block subtype: ".concat(nextBlock.subtype, " with block hash: ").concat(nextBlock.hash) }];
                        }
                        assetCrawler.assetChain.push({
                            state: "(return_to_nft_seller)",
                            type: type,
                            account: originalOwner,
                            owner: originalOwner,
                            locked: false,
                            traceLength: assetCrawler.traceLength,
                            block_link: nextBlock.link,
                            block_hash: nextBlock.hash,
                            block_height: nextBlock.height,
                            block_account: payingAccount,
                            block_representative: nextBlock.representative,
                            block_type: nextBlock.type,
                            block_subtype: nextBlock.subtype,
                            block_amount: nextBlock.amount
                        });
                        // TODO: Maybe specify what info should be used here
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
                        assetCrawler.head = sendAtomicSwap.block_hash;
                        assetCrawler.headHeight = parseInt(sendAtomicSwap.block_height);
                    }
                    return [2 /*return*/, { status: "ok", value: true }];
            }
        });
    });
}
exports.atomicSwapPayableCrawl = atomicSwapPayableCrawl;
//# sourceMappingURL=atomic-swap-payable.js.map