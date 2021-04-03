import * as puppeteer from "puppeteer";

/**
 * Type defenition for the finviz stock data that is returned. This stock data is displayed on the [Finviz](https://finviz.com/quote.ashx) website.
 */
export type FinVizObject = { [key: string]: string };

export class Finviz {
  /**
   * A Function that fetches stock data for a particular stock.
   * @param symbol The stock ticker/symbol used to reference this stock on an exchange.
   * @param attributes (Optional) a list of attributes that can be passed in to filter the stock data.
   * @event Error throws an execption when stock data can't be retrieved.
   * @returns A promise which can be resolved that contains the relevant stock data.
   */
  public static async getStockData(
    symbol: string,
    attributes?: FinVizAttribute[]
  ): Promise<FinVizObject> {
    // Convert symbols like BRK.B to BRK-B
    symbol = symbol.replace(/\./g, "-");
    let companyData: FinVizObject = {};

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3205.0 Safari/537.36"
    );
    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font" ||
        request.resourceType() === "media"
      ) {
        //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
        request.abort();
      } else if (
        request.resourceType() === "script" ||
        request.resourceType() === "xhr"
      ) {
        if (request.url().search(/:\/\/.*finviz\.com\//) !== -1) {
          //console.log("ALLOW: " + request.resourceType() + "@" + request.url());
          request.continue();
        } else {
          //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
          request.abort();
        }
      } else if (request.resourceType() === "document") {
        //console.log("ALLOW: " + request.resourceType() + "@" + request.url());
        request.continue();
      } else {
        //console.log("BLOCK: " + request.resourceType() + "@" + request.url());
        request.abort();
      }
    });

    //page.on('console', msg => console.log('PAGE_LOG:', msg.text));

    try {
      await page.goto(`https://finviz.com/quote.ashx?t=${symbol}`);

      const selector = ".snapshot-table2 tbody tr td";
      await page.waitForSelector(selector, { timeout: 9000 });

      let pageData: string[] = (await page.evaluate(() => {
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
      }, symbol)) as string[];

      for (let i = 0; i < pageData.length; i += 2) {
        const key: string = pageData[i] as string;
        const value = pageData[i + 1];

        if (companyData[key] === undefined) {
          companyData[key] = value;
        } else {
          companyData[key + " %"] = value;
        }
      }

      if (attributes?.length) {
        companyData = attributes.reduce(
          (acc: FinVizObject, attr: FinVizAttribute) => {
            acc[attr] = companyData[attr];
            return acc;
          },
          {}
        );
      }

      browser.close();
      return companyData;
    } catch (err) {
      console.error(err.stack ? err.stack : err);
    }

    browser.close();
    throw new Error(`unable to fetch data for ${symbol}`);
  }
}

/**
 * An enumeration for the data fields that is shown on the [Finviz](https://finviz.com/quote.ashx) website.
 */
export enum FinVizAttribute {
  ATR = "ATR",
  AVARAGE_VOLUME = "Avg Volume",
  BETA = "Beta",
  BOOK_SHARES = "Book/sh",
  CASH_SHARES = "Cash/sh",
  CHANGE = "Change",
  CURRENT_RATIO = "Current Ratio",
  DEBT_EQUITY = "Debt/Eq",
  DIVIDEND = "Dividend",
  DIVIDEND_PERCENT = "Dividend %",
  EARNINGS = "Earnings",
  EMPLOYEES = "Employees",
  EPS = "EPS (ttm)",
  EPS_NEXT_QUARTER = "EPS next Q",
  EPS_NEXT_5Y = "EPS next 5Y",
  EPS_NEXT_YEAR = "EPS next Y",
  EPS_NEXT_YEAR_PERC = "EPS next Y %",
  EPS_PAST_5Y = "EPS past 5Y",
  EPS_QQ = "EPS Q/Q",
  EPS_THIS_YEAR = "EPS this Y",
  FORWARD_PE = "Forward P/E",
  GROSS_MARGIN = "Gross Margin",
  INCOME = "Income",
  INDEX = "Index",
  INSIDER_OWNERSHIP = "Insider Own",
  INSIDER_TRANSACTIONS = "Insider Trans",
  INSTITUTIONAL_OWNERSHIP = "Inst Own",
  INSTITUTIONAL_TRANSACTIONS = "Inst Trans",
  LT_DEBT_EQUITY = "LT Debt/Eq",
  MARKET_CAP = "Market Cap",
  OPERATING_MARGIN = "Oper. Margin",
  OPTIONABLE = "Optionable",
  P_FCF = "P/FCF",
  PAYOUT = "Payout",
  PB = "P/B",
  PC = "P/C",
  PE = "P/E",
  PEG = "PEG",
  PERFORMANCE_HALF_YEAR = "Perf Half Y",
  PERFORMANCE_MONTHLY = "Perf Month",
  PERFORMANCE_QUARTER = "Perf Quarter",
  PERFORMANCE_WEEK = "Perf Week",
  PERFORMANCE_YEAR = "Perf Year",
  PERFORMANCE_YTD = "Perf YTD",
  PREV_CLOSE = "Prev Close",
  PRICE = "Price",
  PROFIT_MARGIN = "Profit Margin",
  PS = "P/S",
  QUICK_RATIO = "Quick Ratio",
  RECOM = "Recom",
  RELATIVE_VOLUME = "Rel Volume",
  ROA = "ROA",
  ROE = "ROE",
  ROI = "ROI",
  RSI = "RSI (14)",
  SALES = "Sales",
  SALES_PAST_5Y = "Sales past 5Y",
  SALES_QQ = "Sales Q/Q",
  SHARES_FLOATING = "Shs Float",
  SHARES_OUTSTANDING = "Shs Outstand",
  SHORT_FLOATING = "Short Float",
  SHORT_RATIO = "Short Ratio",
  SHORTABLE = "Shortable",
  SMA_20 = "SMA20",
  SMA_50 = "SMA50",
  SMA_200 = "SMA200",
  TARGET_PRICE = "Target Price",
  VOLATILITY = "Volatility",
  VOLUME = "Volume",
  YEARLY_RANGE = "52W Range",
  YEAR_HIGH = "52W High",
  YEAR_LOW = "52W Low",
}
