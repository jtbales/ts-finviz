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
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer = require("puppeteer");
var Finviz = /** @class */ (function () {
    function Finviz() {
    }
    /**
     * A Function that fetches stock data for a particular stock.
     * @param symbol The stock ticker/symbol used to reference this stock on an exchange.
     * @param attributes (Optional) a list of attributes that can be passed in to filter the stock data.
     * @event Error throws an execption when stock data can't be retrieved.
     * @returns A promise which can be resolved that contains the relevant stock data.
     */
    Finviz.getStockData = function (symbol, attributes) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var companyData, browser, page, selector, pageData, i, key, value, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Convert symbols like BRK.B to BRK-B
                        symbol = symbol.replace(/\./g, '-');
                        companyData = {};
                        return [4 /*yield*/, puppeteer.launch({ args: ['--no-sandbox'] })];
                    case 1:
                        browser = _b.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _b.sent();
                        return [4 /*yield*/, page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3205.0 Safari/537.36')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.setRequestInterception(true)];
                    case 4:
                        _b.sent();
                        page.on('request', function (request) {
                            if (request.resourceType() === 'image' ||
                                request.resourceType() === 'stylesheet' ||
                                request.resourceType() === 'font' ||
                                request.resourceType() === 'media') {
                                //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
                                request.abort();
                            }
                            else if (request.resourceType() === 'script' ||
                                request.resourceType() === 'xhr') {
                                if (request.url().search(/:\/\/.*finviz\.com\//) !== -1) {
                                    //console.log("ALLOW: " + request.resourceType() + "@" + request.url());
                                    request.continue();
                                }
                                else {
                                    //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
                                    request.abort();
                                }
                            }
                            else if (request.resourceType() === 'document') {
                                //console.log("ALLOW: " + request.resourceType() + "@" + request.url());
                                request.continue();
                            }
                            else {
                                //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
                                request.abort();
                            }
                        });
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 9, , 10]);
                        return [4 /*yield*/, page.goto("https://finviz.com/quote.ashx?t=" + symbol)];
                    case 6:
                        _b.sent();
                        selector = '.snapshot-table2 tbody tr td';
                        return [4 /*yield*/, page.waitForSelector(selector, { timeout: 9000 })];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                // Line 1
                                var tableRoot = document.getElementsByClassName('snapshot-table2'); // Line 2
                                var tableBody = tableRoot[0].getElementsByTagName('tbody'); // ....
                                var tableRows = tableBody[0].getElementsByTagName('tr');
                                var companyData = [];
                                for (var idx = 0; idx < tableRows.length; idx++) {
                                    var tableData = tableRows[idx].getElementsByTagName('td');
                                    for (var jdx = 0; jdx < tableData.length; jdx++) {
                                        companyData.push(tableData[jdx].textContent);
                                    }
                                }
                                return companyData;
                            }, symbol)];
                    case 8:
                        pageData = _b.sent();
                        for (i = 0; i < pageData.length; i += 2) {
                            key = pageData[i];
                            value = pageData[i + 1];
                            if (companyData[key] === undefined) {
                                companyData[key] = value;
                            }
                            else {
                                companyData[key + ' %'] = value;
                            }
                        }
                        if ((_a = attributes) === null || _a === void 0 ? void 0 : _a.length) {
                            companyData = attributes.reduce(function (acc, attr) {
                                acc[attr] = companyData[attr];
                                return acc;
                            }, {});
                        }
                        browser.close();
                        return [2 /*return*/, companyData];
                    case 9:
                        err_1 = _b.sent();
                        console.error(err_1.stack ? err_1.stack : err_1);
                        return [3 /*break*/, 10];
                    case 10:
                        browser.close();
                        throw new Error("unable to fetch data for " + symbol);
                }
            });
        });
    };
    ;
    return Finviz;
}());
exports.Finviz = Finviz;
/**
* An enumeration for the data fields that is shown on the [Finviz](https://finviz.com/quote.ashx) website.
*/
var FinVizAttribute;
(function (FinVizAttribute) {
    FinVizAttribute["ATR"] = "ATR";
    FinVizAttribute["AVARAGE_VOLUME"] = "Avg Volume";
    FinVizAttribute["BETA"] = "Beta";
    FinVizAttribute["BOOK_SHARES"] = "Book/sh";
    FinVizAttribute["CASH_SHARES"] = "Cash/sh";
    FinVizAttribute["CHANGE"] = "Change";
    FinVizAttribute["CURRENT_RATIO"] = "Current Ratio";
    FinVizAttribute["DEBT_EQUITY"] = "Debt/Eq";
    FinVizAttribute["DIVIDEND"] = "Dividend";
    FinVizAttribute["DIVIDEND_PERCENT"] = "Dividend %";
    FinVizAttribute["EARNINGS"] = "Earnings";
    FinVizAttribute["EMPLOYEES"] = "Employees";
    FinVizAttribute["EPS"] = "EPS (ttm)";
    FinVizAttribute["EPS_NEXT_QUARTER"] = "EPS next Q";
    FinVizAttribute["EPS_NEXT_5Y"] = "EPS next 5Y";
    FinVizAttribute["EPS_NEXT_YEAR"] = "EPS next Y";
    FinVizAttribute["EPS_NEXT_YEAR_PERC"] = "EPS next Y %";
    FinVizAttribute["EPS_PAST_5Y"] = "EPS past 5Y";
    FinVizAttribute["EPS_QQ"] = "EPS Q/Q";
    FinVizAttribute["EPS_THIS_YEAR"] = "EPS this Y";
    FinVizAttribute["FORWARD_PE"] = "Forward P/E";
    FinVizAttribute["GROSS_MARGIN"] = "Gross Margin";
    FinVizAttribute["INCOME"] = "Income";
    FinVizAttribute["INDEX"] = "Index";
    FinVizAttribute["INSIDER_OWNERSHIP"] = "Insider Own";
    FinVizAttribute["INSIDER_TRANSACTIONS"] = "Insider Trans";
    FinVizAttribute["INSTITUTIONAL_OWNERSHIP"] = "Inst Own";
    FinVizAttribute["INSTITUTIONAL_TRANSACTIONS"] = "Inst Trans";
    FinVizAttribute["LT_DEBT_EQUITY"] = "LT Debt/Eq";
    FinVizAttribute["MARKET_CAP"] = "Market Cap";
    FinVizAttribute["OPERATING_MARGIN"] = "Oper. Margin";
    FinVizAttribute["OPTIONABLE"] = "Optionable";
    FinVizAttribute["P_FCF"] = "P/FCF";
    FinVizAttribute["PAYOUT"] = "Payout";
    FinVizAttribute["PB"] = "P/B";
    FinVizAttribute["PC"] = "P/C";
    FinVizAttribute["PE"] = "P/E";
    FinVizAttribute["PEG"] = "PEG";
    FinVizAttribute["PERFORMANCE_HALF_YEAR"] = "Perf Half Y";
    FinVizAttribute["PERFORMANCE_MONTHLY"] = "Perf Month";
    FinVizAttribute["PERFORMANCE_QUARTER"] = "Perf Quarter";
    FinVizAttribute["PERFORMANCE_WEEK"] = "Perf Week";
    FinVizAttribute["PERFORMANCE_YEAR"] = "Perf Year";
    FinVizAttribute["PERFORMANCE_YTD"] = "Perf YTD";
    FinVizAttribute["PREV_CLOSE"] = "Prev Close";
    FinVizAttribute["PRICE"] = "Price";
    FinVizAttribute["PROFIT_MARGIN"] = "Profit Margin";
    FinVizAttribute["PS"] = "P/S";
    FinVizAttribute["QUICK_RATIO"] = "Quick Ratio";
    FinVizAttribute["RECOM"] = "Recom";
    FinVizAttribute["RELATIVE_VOLUME"] = "Rel Volume";
    FinVizAttribute["ROA"] = "ROA";
    FinVizAttribute["ROE"] = "ROE";
    FinVizAttribute["ROI"] = "ROI";
    FinVizAttribute["RSI"] = "RSI (14)";
    FinVizAttribute["SALES"] = "Sales";
    FinVizAttribute["SALES_PAST_5Y"] = "Sales past 5Y";
    FinVizAttribute["SALES_QQ"] = "Sales Q/Q";
    FinVizAttribute["SHARES_FLOATING"] = "Shs Float";
    FinVizAttribute["SHARES_OUSTANDING"] = "Shs Outstand";
    FinVizAttribute["SHORT_FLOATING"] = "Short Float";
    FinVizAttribute["SHORT_RATIO"] = "Short Ratio";
    FinVizAttribute["SHORTABLE"] = "Shortable";
    FinVizAttribute["SMA_20"] = "SMA20";
    FinVizAttribute["SMA_50"] = "SMA50";
    FinVizAttribute["SMA_200"] = "SMA200";
    FinVizAttribute["TARGET_PRICE"] = "Target Price";
    FinVizAttribute["VOLATILITY"] = "Volatility";
    FinVizAttribute["VOLUME"] = "Volume";
    FinVizAttribute["YEARLY_RANGE"] = "52W Range";
    FinVizAttribute["YEAR_HIGH"] = "52W High";
    FinVizAttribute["YEAR_LOW"] = "52W Low";
})(FinVizAttribute = exports.FinVizAttribute || (exports.FinVizAttribute = {}));
//# sourceMappingURL=index.js.map