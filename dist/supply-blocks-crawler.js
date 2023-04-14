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
exports.SupplyBlocksCrawler = void 0;
var nano_account_forward_crawler_1 = require("nano-account-crawler/dist/nano-account-forward-crawler");
var account_data_type_1 = require("./account-data-type");
var supply_1 = require("./block-parsers/supply");
var constants_1 = require("./constants");
// Crawler to find all supply blocks by an issuer
var SupplyBlocksCrawler = /** @class */ (function () {
    function SupplyBlocksCrawler(issuer, head, offset) {
        if (head === void 0) { head = undefined; }
        if (offset === void 0) { offset = "0"; }
        this._errors = [];
        this._issuer = issuer;
        this._head = head;
        this._offset = offset;
        this.ignoreMetadataRepresentatives || (this.ignoreMetadataRepresentatives = []);
    }
    SupplyBlocksCrawler.prototype.crawl = function (nanoNode, maxRpcIterations) {
        var _a, e_1, _b, _c;
        if (maxRpcIterations === void 0) { maxRpcIterations = constants_1.MAX_RPC_ITERATIONS; }
        return __awaiter(this, void 0, void 0, function () {
            var banCrawler, error_1, supplyBlocks, frontierCheckedBlock, metadataRepresentatives, _d, banCrawler_1, banCrawler_1_1, followedByBlockStatusReturn, followedByBlock, e_1_1, error_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        banCrawler = new nano_account_forward_crawler_1.NanoAccountForwardCrawler(nanoNode, this._issuer, this._head, this._offset);
                        banCrawler.maxRpcIterations = maxRpcIterations;
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
                        supplyBlocks = [];
                        frontierCheckedBlock = undefined;
                        metadataRepresentatives = [];
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 18, , 19]);
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, 11, 12, 17]);
                        _d = true, banCrawler_1 = __asyncValues(banCrawler);
                        _e.label = 7;
                    case 7: return [4 /*yield*/, banCrawler_1.next()];
                    case 8:
                        if (!(banCrawler_1_1 = _e.sent(), _a = banCrawler_1_1.done, !_a)) return [3 /*break*/, 10];
                        _c = banCrawler_1_1.value;
                        _d = false;
                        try {
                            followedByBlockStatusReturn = _c;
                            if (followedByBlockStatusReturn.status == "error") {
                                this._errors.push(Error("".concat(followedByBlockStatusReturn.error_type, ": ").concat(followedByBlockStatusReturn.message)));
                                return [2 /*return*/];
                            }
                            followedByBlock = followedByBlockStatusReturn.value;
                            if (this.validateSupplyBlock(frontierCheckedBlock, followedByBlock, metadataRepresentatives)) {
                                supplyBlocks.push(frontierCheckedBlock);
                                metadataRepresentatives.push(followedByBlock.representative);
                            }
                            // Cache followedByBlock that is ahead of block in next iteration
                            frontierCheckedBlock = followedByBlock;
                            this._head = frontierCheckedBlock.hash;
                            this._headHeight = parseInt(frontierCheckedBlock.height);
                            if (this.validateSupplyRepresentative(frontierCheckedBlock.representative)) {
                                this._offset = "-1";
                            }
                            else {
                                this._offset = "0";
                            }
                        }
                        finally {
                            _d = true;
                        }
                        _e.label = 9;
                    case 9: return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 17];
                    case 12:
                        _e.trys.push([12, , 15, 16]);
                        if (!(!_d && !_a && (_b = banCrawler_1.return))) return [3 /*break*/, 14];
                        return [4 /*yield*/, _b.call(banCrawler_1)];
                    case 13:
                        _e.sent();
                        _e.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 16: return [7 /*endfinally*/];
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        error_2 = _e.sent();
                        this._errors.push(error_2);
                        return [2 /*return*/];
                    case 19:
                        this.supplyBlocks = supplyBlocks;
                        this.metadataRepresentatives = metadataRepresentatives;
                        return [2 /*return*/, supplyBlocks];
                }
            });
        });
    };
    // https://github.com/Airtune/73-meta-tokens/blob/main/meta_ledger_protocol/supply_block.md#validation
    SupplyBlocksCrawler.prototype.validateSupplyBlock = function (block, followedByBlock, metadataRepresentatives) {
        if (block === undefined) {
            return false;
        }
        // Only change blocks can serve as change#supply blocks.  
        if (block.subtype !== 'change') {
            return false;
        }
        // Must be followed by a mint block, i.e., any block that changes representative without matching an established representative header.
        if (followedByBlock === undefined) {
            return false;
        }
        if (block.representative === followedByBlock.representative) {
            return false;
        }
        // Mint block representative must not be special accounts or contain a data encoding header.
        if ((0, account_data_type_1.accountDataType)(followedByBlock.representative) !== "unknown") {
            return false;
        }
        // Supply block cannot reuse metadata representative
        if (metadataRepresentatives.includes(followedByBlock.representative)) {
            return false;
        }
        if (this.ignoreMetadataRepresentatives.includes(followedByBlock.representative)) {
            return false;
        }
        return this.validateSupplyRepresentative(block.representative);
    };
    SupplyBlocksCrawler.prototype.validateSupplyRepresentative = function (representative) {
        // Check if representative is a parsable supply_representative with a supported version
        var supplyData = (0, supply_1.parseSupplyRepresentative)(representative);
        if (!supplyData) {
            return false;
        }
        if (!constants_1.META_PROTOCOL_SUPPORTED_VERSIONS.includes(supplyData.version)) {
            return false;
        }
        return true;
    };
    Object.defineProperty(SupplyBlocksCrawler.prototype, "head", {
        get: function () {
            return this._head;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SupplyBlocksCrawler.prototype, "headHeight", {
        get: function () {
            return this._headHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SupplyBlocksCrawler.prototype, "errors", {
        get: function () {
            return this._errors;
        },
        enumerable: false,
        configurable: true
    });
    return SupplyBlocksCrawler;
}());
exports.SupplyBlocksCrawler = SupplyBlocksCrawler;
//# sourceMappingURL=supply-blocks-crawler.js.map