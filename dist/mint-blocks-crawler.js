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
exports.MintBlocksCrawler = void 0;
var nano_account_forward_crawler_1 = require("nano-account-crawler/dist/nano-account-forward-crawler");
var banano_ipfs_1 = require("./lib/banano-ipfs");
var supply_1 = require("./block-parsers/supply");
var validate_mint_block_1 = require("./validate-mint-block");
var constants_1 = require("./constants");
// Crawler to find all mint blocks for a specific supply block
var MintBlocksCrawler = /** @class */ (function () {
    function MintBlocksCrawler(issuer, nftSupplyBlockHash) {
        this._issuer = issuer;
        this._nftSupplyBlockHash = nftSupplyBlockHash;
    }
    MintBlocksCrawler.prototype.crawl = function (nanoNode, maxRpcIterations) {
        var e_1, _a;
        if (maxRpcIterations === void 0) { maxRpcIterations = constants_1.MAX_RPC_ITERATIONS; }
        return __awaiter(this, void 0, void 0, function () {
            var banCrawler, blockOffset, banCrawler_1, banCrawler_1_1, block, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        banCrawler = new nano_account_forward_crawler_1.NanoAccountForwardCrawler(nanoNode, this._issuer, this._nftSupplyBlockHash);
                        return [4 /*yield*/, banCrawler.initialize()];
                    case 1:
                        _b.sent();
                        banCrawler.maxRpcIterations = maxRpcIterations;
                        this._mintBlocks = [];
                        blockOffset = 0;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        banCrawler_1 = __asyncValues(banCrawler);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, banCrawler_1.next()];
                    case 4:
                        if (!(banCrawler_1_1 = _b.sent(), !banCrawler_1_1.done)) return [3 /*break*/, 6];
                        block = banCrawler_1_1.value;
                        if (blockOffset === 0) {
                            if (!this.parseSupplyBlock(block)) {
                                throw Error("SupplyBlockError: Unable to parse supply block: ".concat(block.hash));
                            }
                        }
                        else if (this.parseFinishSupplyBlock(block)) {
                            return [3 /*break*/, 6];
                        }
                        else if (blockOffset === 1) {
                            if (block.representative === constants_1.CANCEL_SUPPLY_REPRESENTATIVE) {
                                return [3 /*break*/, 6];
                            }
                            ;
                            (0, validate_mint_block_1.validateMintBlock)(block);
                            this.parseFirstMint(block);
                            this._mintBlocks.push(block);
                        }
                        else if (blockOffset > 1 && block.representative === this._metadataRepresentative) {
                            try {
                                (0, validate_mint_block_1.validateMintBlock)(block);
                                this._mintBlocks.push(block);
                            }
                            catch (error) {
                                if (!error.message.match(/^MintBlockError\:/)) {
                                    throw error;
                                }
                            }
                        }
                        if (this.supplyExceeded()) {
                            return [3 /*break*/, 6];
                        }
                        blockOffset = blockOffset + 1;
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(banCrawler_1_1 && !banCrawler_1_1.done && (_a = banCrawler_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(banCrawler_1)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
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
    MintBlocksCrawler.prototype.parseSupplyBlock = function (block) {
        var supplyData = (0, supply_1.parseSupplyRepresentative)(block.representative);
        if (!supplyData) {
            return false;
        }
        var version = supplyData.version, maxSupply = supplyData.maxSupply;
        this._version = version;
        this._maxSupply = maxSupply;
        this._nftSupplyBlock = block;
        this._hasLimitedSupply = this._maxSupply > BigInt("0");
        return true;
    };
    MintBlocksCrawler.prototype.parseFinishSupplyBlock = function (block) {
        var finishSupplyData = (0, supply_1.parseFinishSupplyRepresentative)(block.representative);
        if (!finishSupplyData) {
            return false;
        }
        var supplyBlockHeight = finishSupplyData.supplyBlockHeight;
        return supplyBlockHeight === BigInt(this._nftSupplyBlock.height);
    };
    MintBlocksCrawler.prototype.parseFirstMint = function (block) {
        this._metadataRepresentative = block.representative;
        this._ipfsCID = banano_ipfs_1.bananoIpfs.accountToIpfsCidV0(this._metadataRepresentative);
    };
    MintBlocksCrawler.prototype.supplyExceeded = function () {
        return this._hasLimitedSupply && BigInt(this._mintBlocks.length) >= this._maxSupply;
    };
    return MintBlocksCrawler;
}());
exports.MintBlocksCrawler = MintBlocksCrawler;
//# sourceMappingURL=mint-blocks-crawler.js.map