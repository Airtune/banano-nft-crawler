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
        while (_) try {
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownedCrawl = void 0;
var nano_account_forward_crawler_1 = require("nano-account-crawler/dist/nano-account-forward-crawler");
// constants
var constants_1 = require("../../constants");
var atomic_swap_1 = require("../../block-parsers/atomic-swap");
// State for when the the block's account own the asset.
function ownedCrawl(nanoNode, assetCrawler) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var frontierCrawler, frontierCrawler_1, frontierCrawler_1_1, nanoBlock, assetBlock, e_1_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    frontierCrawler = new nano_account_forward_crawler_1.NanoAccountForwardCrawler(nanoNode, assetCrawler.frontier.owner, assetCrawler.frontier.nanoBlock.hash, "1");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, frontierCrawler.initialize()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 8, 9, 14]);
                    frontierCrawler_1 = __asyncValues(frontierCrawler);
                    _b.label = 4;
                case 4: return [4 /*yield*/, frontierCrawler_1.next()];
                case 5:
                    if (!(frontierCrawler_1_1 = _b.sent(), !frontierCrawler_1_1.done)) return [3 /*break*/, 7];
                    nanoBlock = frontierCrawler_1_1.value;
                    assetCrawler.traceLength += BigInt(1);
                    assetCrawler.head = nanoBlock.hash;
                    assetCrawler.headHeight = parseInt(nanoBlock.height);
                    assetBlock = toAssetBlock(assetCrawler, nanoBlock);
                    if (assetBlock === undefined) {
                        return [3 /*break*/, 6];
                    }
                    assetCrawler.assetChain.push(assetBlock);
                    return [2 /*return*/, true];
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _b.trys.push([9, , 12, 13]);
                    if (!(frontierCrawler_1_1 && !frontierCrawler_1_1.done && (_a = frontierCrawler_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(frontierCrawler_1)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [3 /*break*/, 16];
                case 15:
                    error_1 = _b.sent();
                    throw (error_1);
                case 16: return [2 /*return*/, false];
            }
        });
    });
}
exports.ownedCrawl = ownedCrawl;
function toAssetBlock(assetCrawler, block) {
    if (block.type !== 'state') {
        return undefined;
    }
    if (block.subtype === 'send') {
        if (block.representative === assetCrawler.assetRepresentative || block.representative === constants_1.SEND_ALL_NFTS_REPRESENTATIVE) {
            var recipient = block.account;
            var state = void 0;
            var type = void 0;
            if (constants_1.BURN_ACCOUNTS.includes(recipient)) {
                state = "burned";
                type = "send#burn";
            }
            else {
                state = "receivable";
                type = "send#asset";
            }
            return {
                state: state,
                type: type,
                account: recipient,
                owner: recipient,
                locked: false,
                nanoBlock: block,
                traceLength: assetCrawler.traceLength
            };
        }
        var ownerAccount = assetCrawler.frontier.owner;
        var payingAccount = block.account;
        var representative = block.representative;
        var atomicSwapConditions = (0, atomic_swap_1.parseAtomicSwapRepresentative)(representative);
        var ownershipBlockHeight = BigInt(assetCrawler.frontier.nanoBlock.height);
        var attemptTradeWithSelf = payingAccount == ownerAccount;
        var validReceiveHeight = atomicSwapConditions && atomicSwapConditions.receiveHeight >= BigInt(2);
        var currentAssetHeight = atomicSwapConditions && atomicSwapConditions.assetHeight === ownershipBlockHeight;
        var sends1raw = atomicSwapConditions && BigInt(block.amount) == BigInt('1');
        if (!attemptTradeWithSelf && validReceiveHeight && currentAssetHeight && sends1raw) {
            var payingAccount_1 = block.account;
            return {
                state: 'atomic_swap_receivable',
                type: 'send#atomic_swap',
                account: payingAccount_1,
                owner: ownerAccount,
                locked: true,
                nanoBlock: block,
                traceLength: assetCrawler.traceLength
            };
        }
    }
    return undefined;
}
//# sourceMappingURL=owned.js.map