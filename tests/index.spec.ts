import { Finviz, FinVizAttribute } from '../index';

afterEach(() => {
    jest.resetAllMocks();
})

describe('Finviz Test Suite', () => {
    it('should contain expected attributes', () => {
        Object.values(FinVizAttribute).forEach((value: string, index) => {
            expect(value).toEqual(expectedAttrs[index])
        });
    });

    // works on my machine - test timing out
    it('should fetch stock data', async () => {
        const result = await Finviz.getStockData('AAPL');
        expect(result).toBeDefined();
        Object.keys(result).forEach((key, index) => {
            expect(key).toEqual(expectedAttrs.find(entry => entry === key))
            expect(result[key]).toBeDefined();
        });
    });

    it('should fetch stock data', async () => {
        const expectedSelectedAttributes = [FinVizAttribute.PRICE];
        const result = await Finviz.getStockData('AAPL', expectedSelectedAttributes);
        expect(result).toBeDefined();
        expectedSelectedAttributes.forEach(attr => {
            expect(result[attr]).toBeDefined();
        })

    });
});

const expectedAttrs: string[] = [
    'ATR',
    'Avg Volume',
    'Beta',
    'Book/sh',
    'Cash/sh',
    'Change',
    'Current Ratio',
    'Debt/Eq',
    'Dividend',
    'Dividend %',
    'Earnings',
    'Employees',
    'EPS (ttm)',
    'EPS next Q',
    'EPS next 5Y',
    'EPS next Y',
    'EPS next Y %',
    'EPS past 5Y',
    'EPS Q/Q',
    'EPS this Y',
    'Forward P/E',
    'Gross Margin',
    'Income',
    'Index',
    'Insider Own',
    'Insider Trans',
    'Inst Own',
    'Inst Trans',
    'LT Debt/Eq',
    'Market Cap',
    'Oper. Margin',
    'Optionable',
    'P/FCF',
    'Payout',
    'P/B',
    'P/C',
    'P/E',
    'PEG',
    'Perf Half Y',
    'Perf Month',
    'Perf Quarter',
    'Perf Week',
    'Perf Year',
    'Perf YTD',
    'Prev Close',
    'Price',
    'Profit Margin',
    'P/S',
    'Quick Ratio',
    'Recom',
    'Rel Volume',
    'ROA',
    'ROE',
    'ROI',
    'RSI (14)',
    'Sales',
    'Sales past 5Y',
    'Sales Q/Q',
    'Shs Float',
    'Shs Outstand',
    'Short Float',
    'Short Ratio',
    'Shortable',
    'SMA20',
    'SMA50',
    'SMA200',
    'Target Price',
    'Volatility',
    'Volume',
    '52W Range',
    '52W High',
    '52W Low'
]
