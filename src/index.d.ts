// Type definitions for ts-finviz 0.1.0
// Project: ts-finviz
// Definitions by: Rhys Williams https://github.com/RhysWilliams12

/** 
 * A namespace for the ts-finviz npm module
*/
export namespace tsFinviz {
    /**
     * Type defenition for the finviz stock data that is returned. This stock data is displayed on the [Finviz](https://finviz.com/quote.ashx) website.
     */
    export type FinVizObject = { [key: string]: string };

    /**
     * A Function that fetches stock data for a particular stock.
     * @param symbol The stock ticker/symbol used to reference this stock on an exchange.
     * @param attributes (Optional) a list of attributes that can be passed in to filter the stock data.
     * @event Error throws an execption when stock data can't be retrieved.
     * @returns A promise which can be resolved that contains the relevant stock data.
     */
    export class Finviz {
        getStockData(symbol: string, attributes?: FinVizAttribute[]): Promise<FinVizObject>;
    }

    /**
     * An enumeration for the data fields that is shown on the [Finviz](https://finviz.com/quote.ashx) website.
     */
    export enum FinVizAttribute {
        ATR = 'ATR',
        AVARAGE_VOLUME = 'Avg Volume',
        BETA = 'Beta',
        BOOK_SHARES = 'Book/sh',
        CASH_SHARES = 'Cash/sh',
        CHANGE = 'Change',
        CURRENT_RATIO = 'Current Ratio',
        DEBT_EQUITY = 'Debt/Eq',
        DIVIDEND = 'Dividend',
        DIVIDEND_PERCENT = 'Dividend %',
        EARNINGS = 'Earnings',
        EMPLOYEES = 'Employees',
        EPS = 'EPS (ttm)',
        EPS_NEXT_QUARTER = 'EPS next Q',
        EPS_NEXT_5Y = 'EPS next 5Y',
        EPS_NEXT_YEAR = 'EPS next Y',
        EPS_NEXT_YEAR_PERC = 'EPS next Y %',
        EPS_PAST_5Y = 'EPS past 5Y',
        EPS_QQ = 'EPS Q/Q',
        EPS_THIS_YEAR = 'EPS this Y',
        FORWARD_PE = 'Forward P/E',
        GROSS_MARGIN = 'Gross Margin',
        INCOME = 'Income',
        INDEX = 'Index',
        INSIDER_OWNERSHIP = 'Insider Own',
        INSIDER_TRANSACTIONS = 'Insider Trans',
        INSTITUTIONAL_OWNERSHIP = 'Inst Own',
        INSTITUTIONAL_TRANSACTIONS = 'Inst Trans',
        LT_DEBT_EQUITY = 'LT Debt/Eq',
        MARKET_CAP = 'Market Cap',
        OPERATING_MARGIN = 'Oper. Margin',
        OPTIONABLE = 'Optionable',
        P_FCF = 'P/FCF',
        PAYOUT = 'Payout',
        PB = 'P/B',
        PC = 'P/C',
        PE = 'P/E',
        PEG = 'PEG',
        PERFORMANCE_HALF_YEAR = 'Perf Half Y',
        PERFORMANCE_MONTHLY = 'Perf Month',
        PERFORMANCE_QUARTER = 'Perf Quarter',
        PERFORMANCE_WEEK = 'Perf Week',
        PERFORMANCE_YEAR = 'Perf Year',
        PERFORMANCE_YTD = 'Perf YTD',
        PREV_CLOSE = 'Prev Close',
        PRICE = 'Price',
        PROFIT_MARGIN = 'Profit Margin',
        PS = 'P/S',
        QUICK_RATIO = 'Quick Ratio',
        RECOM = 'Recom',
        RELATIVE_VOLUME = 'Rel Volume',
        ROA = 'ROA',
        ROE = 'ROE',
        ROI = 'ROI',
        RSI = 'RSI (14)',
        SALES = 'Sales',
        SALES_PAST_5Y = 'Sales past 5Y',
        SALES_QQ = 'Sales Q/Q',
        SHARES_FLOATING = 'Shs Float',
        SHARES_OUSTANDING = 'Shs Outstand',
        SHORT_FLOATING = 'Short Float',
        SHORT_RATIO = 'Short Ratio',
        SHORTABLE = 'Shortable',
        SMA_20 = 'SMA20',
        SMA_50 = 'SMA50',
        SMA_200 = 'SMA200',
        TARGET_PRICE = 'Target Price',
        VOLATILITY = 'Volatility',
        VOLUME = 'Volume',
        YEARLY_RANGE = '52W Range',
        YEAR_HIGH = '52W High',
        YEAR_LOW = '52W Low'
    }
}