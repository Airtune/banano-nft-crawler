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
exports.AssetCrawler = void 0;
// lib
var banano_ipfs_1 = require("./lib/banano-ipfs");
// meta node
var constants_1 = require("./constants");
var atomic_swap_1 = require("./block-parsers/atomic-swap");
// meta block states
var burned_1 = require("./asset-crawler-states/asset/burned");
var mint_1 = require("./asset-crawler-states/asset/mint");
var owned_1 = require("./asset-crawler-states/asset/owned");
var receivable_1 = require("./asset-crawler-states/asset/receivable");
var atomic_swap_receivable_1 = require("./asset-crawler-states/atomic-swap/atomic-swap-receivable");
var atomic_swap_payable_1 = require("./asset-crawler-states/atomic-swap/atomic-swap-payable");
var return_to_nft_seller_1 = require("./asset-crawler-states/return-to-nft-seller");
var assetCrawlerStates = {
    "burned": burned_1.burnedCrawl,
    "owned": owned_1.ownedCrawl,
    "receivable": receivable_1.receivableCrawl,
    "atomic_swap_receivable": atomic_swap_receivable_1.atomicSwapReceivableCrawl,
    "atomic_swap_payable": atomic_swap_payable_1.atomicSwapPayableCrawl,
    "(return_to_nft_seller)": return_to_nft_seller_1.returnToNFTSellerCrawl
};
// Crawler to trace the chain following a single mint of an asset.
var AssetCrawler = /** @class */ (function () {
    function AssetCrawler(issuer, mintBlock) {
        this._issuer = issuer;
        this._mintBlock = mintBlock;
        this._assetChain = [];
        this._traceLength = undefined;
    }
    AssetCrawler.prototype.crawl = function (nanoNode, maxTraceLength) {
        if (maxTraceLength === void 0) { maxTraceLength = constants_1.MAX_TRACE_LENGTH; }
        return __awaiter(this, void 0, void 0, function () {
            var assetMintCrawlStatusReturn, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._assetRepresentative = banano_ipfs_1.bananoIpfs.publicKeyToAccount(this._mintBlock.hash);
                        this._metadataRepresentative = this._mintBlock.representative;
                        this._traceLength = BigInt(1);
                        if (!(!this._assetChain || this._assetChain.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, mint_1.assetMintCrawl)(nanoNode, this, this._mintBlock).catch(function (error) { throw (error); })];
                    case 1:
                        assetMintCrawlStatusReturn = _a.sent();
                        if (assetMintCrawlStatusReturn.status === "error") {
                            return [2 /*return*/, assetMintCrawlStatusReturn];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.crawlFromFrontier(nanoNode, maxTraceLength)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                status: "error",
                                error_type: "UnexpectedError",
                                message: "".concat(error_1)
                            }];
                    case 5:
                        ;
                        return [2 /*return*/, { status: "ok" }];
                }
            });
        });
    };
    AssetCrawler.prototype.initFromCache = function (assetRepresentative, assetChain, initialTraceLength) {
        if (initialTraceLength === void 0) { initialTraceLength = undefined; }
        this._assetRepresentative = assetRepresentative;
        this._assetChain = assetChain;
        this._traceLength = initialTraceLength || this._traceLength;
    };
    AssetCrawler.prototype.crawlFromFrontier = function (nanoNode, maxTraceLength) {
        if (maxTraceLength === void 0) { maxTraceLength = constants_1.MAX_TRACE_LENGTH; }
        return __awaiter(this, void 0, void 0, function () {
            var newStep, crawlStepStatusReturn, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newStep = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        _a.label = 2;
                    case 2:
                        if (!newStep) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.crawlStep(nanoNode)];
                    case 3:
                        crawlStepStatusReturn = _a.sent();
                        if (crawlStepStatusReturn.status === "error") {
                            return [2 /*return*/, crawlStepStatusReturn];
                        }
                        else {
                            newStep = crawlStepStatusReturn.value;
                        }
                        if (this._traceLength >= maxTraceLength) {
                            return [2 /*return*/, { status: "ok" }];
                        }
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                status: "error",
                                error_type: "UnexpectedError",
                                message: "".concat(error_2)
                            }];
                    case 6: return [2 /*return*/, { status: "ok" }];
                }
            });
        });
    };
    AssetCrawler.prototype.crawlStep = function (nanoNode) {
        return __awaiter(this, void 0, void 0, function () {
            var stateCrawlFn, statusReturn, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stateCrawlFn = assetCrawlerStates[this.frontier.state];
                        if (!(typeof stateCrawlFn == "function")) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, stateCrawlFn(nanoNode, this)];
                    case 2:
                        statusReturn = _a.sent();
                        if (statusReturn.status === "ok") {
                            return [2 /*return*/, statusReturn];
                        }
                        else {
                            return [2 /*return*/, {
                                    status: "error",
                                    error_type: "AssetCrawlerError",
                                    message: "Error in asset crawler state: " + statusReturn.message,
                                }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                status: "error",
                                error_type: "AssetCrawlerError",
                                message: error_3.message,
                            }];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, {
                            status: "error",
                            error_type: "UnhandledAssetState",
                            message: "\"".concat(this.frontier.state, "\" was not handled for block: ").concat(this.frontier.block_hash),
                        }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Return minRaw for atomic swap payment if asset is ready for payment. Otherwise return undefined.
    AssetCrawler.prototype.currentAtomicSwapConditions = function () {
        if (this.assetChain[this.assetChain.length - 1].state !== "atomic_swap_payable") {
            return undefined;
        }
        var sendAtomicSwap = this.findSendAtomicSwapBlock();
        if (sendAtomicSwap === undefined) {
            return undefined;
        }
        var atomicSwapRepresentative = sendAtomicSwap.block_representative;
        var atomicSwapConditions = (0, atomic_swap_1.parseAtomicSwapRepresentative)(atomicSwapRepresentative);
        return atomicSwapConditions;
    };
    AssetCrawler.prototype.findSendAtomicSwapBlock = function () {
        if (this.assetChain[this.assetChain.length - 2].state !== "atomic_swap_receivable") {
            return undefined;
        }
        var sendAtomicSwap = this.assetChain[this.assetChain.length - 2];
        return sendAtomicSwap;
    };
    Object.defineProperty(AssetCrawler.prototype, "assetChain", {
        get: function () {
            return this._assetChain;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "frontier", {
        get: function () {
            return this._assetChain[this._assetChain.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "previousFrontier", {
        get: function () {
            return this._assetChain[this._assetChain.length - 2];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "assetRepresentative", {
        get: function () {
            return this._assetRepresentative;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "head", {
        get: function () {
            return this._head;
        },
        set: function (value) {
            this._head = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "headHeight", {
        get: function () {
            return this._headHeight;
        },
        set: function (value) {
            this._headHeight = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "issuer", {
        get: function () {
            return this._issuer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "metadataRepresentative", {
        get: function () {
            return this._metadataRepresentative;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AssetCrawler.prototype, "traceLength", {
        get: function () {
            return this._traceLength;
        },
        set: function (len) {
            this._traceLength = len;
        },
        enumerable: false,
        configurable: true
    });
    return AssetCrawler;
}());
exports.AssetCrawler = AssetCrawler;
//# sourceMappingURL=asset-crawler.js.map