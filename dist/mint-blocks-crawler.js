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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintBlocksCrawler = void 0;
var nano_account_forward_crawler_1 = require("nano-account-crawler/dist/nano-account-forward-crawler");
var banano_ipfs_1 = require("./lib/banano-ipfs");
var supply_1 = require("./block-parsers/supply");
var validate_mint_block_1 = require("./validate-mint-block");
var constants_1 = require("./constants");
// Crawler to find all mint blocks for a specific supply block
var MintBlocksCrawler = /** @class */ (function () {
    function MintBlocksCrawler(issuer, nftSupplyBlockHash) {
        this._cachedData = false;
        this._errors = [];
        this._issuer = issuer;
        this._nftSupplyBlockHash = nftSupplyBlockHash;
        this._finishedSupply = false;
        this._mintBlocks = [];
    }
    MintBlocksCrawler.prototype.initFromCache = function (nftSupplyBlockHeight, mintBlockCount, version, maxSupply, metadataRepresentative) {
        this._nftSupplyBlockHeight = nftSupplyBlockHeight;
        this._mintBlockCount = mintBlockCount;
        this._version = version;
        this._maxSupply = maxSupply;
        this._hasLimitedSupply = this._maxSupply > BigInt("0");
        this._finishedSupply = this.supplyExceeded();
        this._metadataRepresentative = metadataRepresentative;
    };
    MintBlocksCrawler.prototype.cachedCrawlData = function () {
        return typeof (this._nftSupplyBlockHeight) == 'bigint' && typeof (this._mintBlockCount) == 'bigint';
    };
    MintBlocksCrawler.prototype.crawl = function (nanoNode, maxRpcIterations) {
        var _a, e_1, _b, _c;
        if (maxRpcIterations === void 0) { maxRpcIterations = constants_1.MAX_RPC_ITERATIONS; }
        return __awaiter(this, void 0, void 0, function () {
            var banCrawler, blockOffset, error_1, _d, banCrawler_1, banCrawler_1_1, blockStatusReturn, block, validateMintBlockStatusReturn, validateMintBlockStatusReturn, e_1_1, error_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (this._finishedSupply) {
                            return [2 /*return*/];
                        }
                        banCrawler = new nano_account_forward_crawler_1.NanoAccountForwardCrawler(nanoNode, this._issuer, this._nftSupplyBlockHash);
                        banCrawler.maxRpcIterations = maxRpcIterations;
                        this._mintBlocks = [];
                        this._mintBlockCount = BigInt("0");
                        blockOffset = 0;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, banCrawler.initialize()];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _e.sent();
                        this._errors.push(error_1);
                        return [2 /*return*/];
                    case 4:
                        _e.trys.push([4, 17, , 18]);
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 10, 11, 16]);
                        _d = true, banCrawler_1 = __asyncValues(banCrawler);
                        _e.label = 6;
                    case 6: return [4 /*yield*/, banCrawler_1.next()];
                    case 7:
                        if (!(banCrawler_1_1 = _e.sent(), _a = banCrawler_1_1.done, !_a)) return [3 /*break*/, 9];
                        _c = banCrawler_1_1.value;
                        _d = false;
                        try {
                            blockStatusReturn = _c;
                            if (blockStatusReturn.status == "error") {
                                this._errors.push(Error("".concat(blockStatusReturn.error_type, ": ").concat(blockStatusReturn.message)));
                                return [2 /*return*/];
                            }
                            block = blockStatusReturn.value;
                            if (blockOffset === 0) {
                                if (!this.parseSupplyBlock(block)) {
                                    this._errors.push(Error("SupplyBlockError: Unable to parse supply block: ".concat(block.hash)));
                                    return [2 /*return*/];
                                }
                            }
                            else if (this.parseFinishSupplyBlock(block)) {
                                this._finishedSupply = true;
                                return [3 /*break*/, 9];
                            }
                            else if (blockOffset === 1) {
                                if (block.representative === constants_1.CANCEL_SUPPLY_REPRESENTATIVE) {
                                    this._finishedSupply = true;
                                    return [3 /*break*/, 9];
                                }
                                else {
                                    try {
                                        validateMintBlockStatusReturn = (0, validate_mint_block_1.validateMintBlock)(block);
                                        if (validateMintBlockStatusReturn.status === "error") {
                                            this._finishedSupply = true;
                                            return [3 /*break*/, 9];
                                        }
                                        this.parseFirstMint(block);
                                        this._mintBlocks.push(block);
                                        this._mintBlockCount++;
                                    }
                                    catch (error) {
                                        this._errors.push(error);
                                        return [2 /*return*/];
                                    }
                                }
                                ;
                            }
                            else if (blockOffset > 1 && block.representative === this._metadataRepresentative) {
                                try {
                                    validateMintBlockStatusReturn = (0, validate_mint_block_1.validateMintBlock)(block);
                                    if (validateMintBlockStatusReturn.status === "ok") {
                                        this.addMintBlock(block);
                                    }
                                }
                                catch (error) {
                                    this._errors.push(error);
                                    return [2 /*return*/];
                                }
                            }
                            if (this.supplyExceeded()) {
                                this._finishedSupply = true;
                                return [3 /*break*/, 9];
                            }
                            blockOffset = blockOffset + 1;
                        }
                        finally {
                            _d = true;
                        }
                        _e.label = 8;
                    case 8: return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _e.trys.push([11, , 14, 15]);
                        if (!(!_d && !_a && (_b = banCrawler_1.return))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _b.call(banCrawler_1)];
                    case 12:
                        _e.sent();
                        _e.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_2 = _e.sent();
                        this._errors.push(error_2);
                        return [2 /*return*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    MintBlocksCrawler.prototype.crawlFromFrontier = function (nanoNode, frontier, maxRpcIterations) {
        var _a, e_2, _b, _c;
        if (maxRpcIterations === void 0) { maxRpcIterations = constants_1.MAX_RPC_ITERATIONS; }
        return __awaiter(this, void 0, void 0, function () {
            var banCrawler, initializeStatusReturn, error_3, _d, banCrawler_2, banCrawler_2_1, blockStatusReturn, block, validateMintBlockStatusReturn, e_2_1, error_4;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (this._finishedSupply) {
                            return [2 /*return*/];
                        }
                        if (!this.cachedSupplyBlock()) {
                            this._errors.push(Error("CacheError: crawlFromFrontier: Supply block not cached"));
                            return [2 /*return*/];
                        }
                        if (!this.cachedCrawlData()) {
                            this._errors.push(Error("CacheError: crawlFromFrontier: No cached crawl data"));
                            return [2 /*return*/];
                        }
                        if (typeof (this._metadataRepresentative) !== 'string' && this._metadataRepresentative.match(constants_1.ADDRESS_PATTERN)) {
                            this._errors.push(Error("CacheError: crawlFromFrontier: No cached metadata representative"));
                            return [2 /*return*/];
                        }
                        banCrawler = new nano_account_forward_crawler_1.NanoAccountForwardCrawler(nanoNode, this._issuer, frontier, "1");
                        banCrawler.maxRpcIterations = maxRpcIterations;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, banCrawler.initialize()];
                    case 2:
                        initializeStatusReturn = _e.sent();
                        if (initializeStatusReturn.status === "error") {
                            this._errors.push(Error("".concat(initializeStatusReturn.error_type, ": ").concat(initializeStatusReturn.message)));
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _e.sent();
                        this._errors.push(error_3);
                        return [2 /*return*/];
                    case 4:
                        _e.trys.push([4, 17, , 18]);
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 10, 11, 16]);
                        _d = true, banCrawler_2 = __asyncValues(banCrawler);
                        _e.label = 6;
                    case 6: return [4 /*yield*/, banCrawler_2.next()];
                    case 7:
                        if (!(banCrawler_2_1 = _e.sent(), _a = banCrawler_2_1.done, !_a)) return [3 /*break*/, 9];
                        _c = banCrawler_2_1.value;
                        _d = false;
                        try {
                            blockStatusReturn = _c;
                            if (blockStatusReturn.status == "error") {
                                this._errors.push(Error("".concat(blockStatusReturn.error_type, ": ").concat(blockStatusReturn.message)));
                                return [2 /*return*/];
                            }
                            block = blockStatusReturn.value;
                            if (this.parseFinishSupplyBlock(block)) {
                                this._finishedSupply = true;
                                return [3 /*break*/, 9];
                            }
                            else if (block.representative === this._metadataRepresentative) {
                                try {
                                    validateMintBlockStatusReturn = (0, validate_mint_block_1.validateMintBlock)(block);
                                    if (validateMintBlockStatusReturn.status === "ok") {
                                        this.addMintBlock(block);
                                    }
                                }
                                catch (error) {
                                    this._errors.push(error);
                                    return [2 /*return*/];
                                }
                            }
                            if (this.supplyExceeded()) {
                                this._finishedSupply = true;
                                return [3 /*break*/, 9];
                            }
                        }
                        finally {
                            _d = true;
                        }
                        _e.label = 8;
                    case 8: return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _e.trys.push([11, , 14, 15]);
                        if (!(!_d && !_a && (_b = banCrawler_2.return))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _b.call(banCrawler_2)];
                    case 12:
                        _e.sent();
                        _e.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_4 = _e.sent();
                        this._errors.push(error_4);
                        return [2 /*return*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    MintBlocksCrawler.prototype.addMintBlock = function (block) {
        this._mintBlocks.push(block);
        this._mintBlockCount++;
        this._head = block.hash;
        this._headHeight = parseInt(block.height);
    };
    Object.defineProperty(MintBlocksCrawler.prototype, "nftSupplyBlock", {
        get: function () {
            return this._nftSupplyBlock;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "mintBlocks", {
        get: function () {
            return this._mintBlocks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "ipfsCID", {
        get: function () {
            return this._ipfsCID;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "maxSupply", {
        get: function () {
            return this._maxSupply;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "hasLimitedSupply", {
        get: function () {
            return this._hasLimitedSupply;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "finishedSupply", {
        get: function () {
            return this._finishedSupply;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "mintBlockCount", {
        get: function () {
            return this._mintBlockCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "head", {
        get: function () {
            return this._head;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MintBlocksCrawler.prototype, "headHeight", {
        get: function () {
            return this._headHeight;
        },
        enumerable: false,
        configurable: true
    });
    MintBlocksCrawler.prototype.parseSupplyBlock = function (block) {
        var supplyData = (0, supply_1.parseSupplyRepresentative)(block.representative);
        if (!supplyData) {
            return false;
        }
        var version = supplyData.version, maxSupply = supplyData.maxSupply;
        this._version = version;
        this._maxSupply = maxSupply;
        this._nftSupplyBlock = block;
        this._nftSupplyBlockHeight = BigInt(block.height);
        this._hasLimitedSupply = this._maxSupply > BigInt("0");
        return true;
    };
    MintBlocksCrawler.prototype.cachedSupplyBlock = function () {
        return constants_1.META_PROTOCOL_SUPPORTED_VERSIONS.includes(this._version) && typeof (this._maxSupply) === 'bigint' && typeof (this._nftSupplyBlockHeight) === 'bigint' && typeof (this._hasLimitedSupply) == 'boolean';
    };
    MintBlocksCrawler.prototype.parseFinishSupplyBlock = function (block) {
        var finishSupplyData = (0, supply_1.parseFinishSupplyRepresentative)(block.representative);
        if (!finishSupplyData) {
            return false;
        }
        var supplyBlockHeight = finishSupplyData.supplyBlockHeight;
        return supplyBlockHeight === this._nftSupplyBlockHeight;
    };
    MintBlocksCrawler.prototype.parseFirstMint = function (block) {
        this._metadataRepresentative = block.representative;
        this._ipfsCID = banano_ipfs_1.bananoIpfs.accountToIpfsCidV0(this._metadataRepresentative);
    };
    MintBlocksCrawler.prototype.supplyExceeded = function () {
        return this._hasLimitedSupply && this._mintBlockCount >= this._maxSupply;
    };
    Object.defineProperty(MintBlocksCrawler.prototype, "errors", {
        get: function () {
            return this._errors;
        },
        enumerable: false,
        configurable: true
    });
    return MintBlocksCrawler;
}());
exports.MintBlocksCrawler = MintBlocksCrawler;
//# sourceMappingURL=mint-blocks-crawler.js.map