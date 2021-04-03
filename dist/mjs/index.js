import * as puppeteer from "puppeteer";
export class Finviz {
    /**
     * A Function that fetches stock data for a particular stock.
     * @param symbol The stock ticker/symbol used to reference this stock on an exchange.
     * @param attributes (Optional) a list of attributes that can be passed in to filter the stock data.
     * @event Error throws an execption when stock data can't be retrieved.
     * @returns A promise which can be resolved that contains the relevant stock data.
     */
    static async getStockData(symbol, attributes) {
        // Convert symbols like BRK.B to BRK-B
        symbol = symbol.replace(/\./g, "-");
        let companyData = {};
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3205.0 Safari/537.36");
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            if (request.resourceType() === "image" ||
                request.resourceType() === "stylesheet" ||
                request.resourceType() === "font" ||
                request.resourceType() === "media") {
                //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
                request.abort();
            }
            else if (request.resourceType() === "script" ||
                request.resourceType() === "xhr") {
                if (request.url().search(/:\/\/.*finviz\.com\//) !== -1) {
                    //console.log("ALLOW: " + request.resourceType() + "@" + request.url());
                    request.continue();
                }
                else {
                    //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
                    request.abort();
                }
            }
            else if (request.resourceType() === "document") {
                //console.log("ALLOW: " + request.resourceType() + "@" + request.url());
                request.continue();
            }
            else {
                //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
                request.abort();
            }
        });
        //page.on('console', msg => console.log('PAGE_LOG:', msg.text));
        try {
            await page.goto(`https://finviz.com/quote.ashx?t=${symbol}`);
            const selector = ".snapshot-table2 tbody tr td";
            await page.waitForSelector(selector, { timeout: 9000 });
            let pageData = (await page.evaluate(() => {
                // Line 1
                var tableRoot = document.getElementsByClassName("snapshot-table2"); // Line 2
                var tableBody = tableRoot[0].getElementsByTagName("tbody"); // ....
                var tableRows = tableBody[0].getElementsByTagName("tr");
                var companyData = [];
                for (var idx = 0; idx < tableRows.length; idx++) {
                    var tableData = tableRows[idx].getElementsByTagName("td");
                    for (var jdx = 0; jdx < tableData.length; jdx++) {
                        companyData.push(tableData[jdx].textContent);
                    }
                }
                return companyData;
            }, symbol));
            for (let i = 0; i < pageData.length; i += 2) {
                const key = pageData[i];
                const value = pageData[i + 1];
                if (companyData[key] === undefined) {
                    companyData[key] = value;
                }
                else {
                    companyData[key + " %"] = value;
                }
            }
            if (attributes?.length) {
                companyData = attributes.reduce((acc, attr) => {
                    acc[attr] = companyData[attr];
                    return acc;
                }, {});
            }
            browser.close();
            return companyData;
        }
        catch (err) {
            console.error(err.stack ? err.stack : err);
        }
        browser.close();
        throw new Error(`unable to fetch data for ${symbol}`);
    }
}
/**
 * An enumeration for the data fields that is shown on the [Finviz](https://finviz.com/quote.ashx) website.
 */
export var FinVizAttribute;
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
    FinVizAttribute["SHARES_OUTSTANDING"] = "Shs Outstand";
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
})(FinVizAttribute || (FinVizAttribute = {}));
//# sourceMappingURL=index.js.map