export type Quote = {
  ticker: string;
  name: string;
  type: 'etf' | 'stock' | 'bond';
  price: number;
  change: number;
  changePercent: number;
  asOf: string;
  source: 'fixture' | 'yahoo';
  oneLiner?: string;
  risk?: 'lower' | 'medium' | 'higher';
  horizon?: string;
};

const QUOTE_FIXTURES: Record<string, Quote> = {
  // ETFs
  XEQT: { ticker: 'XEQT', name: 'iShares Core Equity ETF Portfolio', type: 'etf',
    price: 32.47, change: 0.18, changePercent: 0.56,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture',
    oneLiner: 'One purchase, 9,000 stocks worldwide.',
    risk: 'medium', horizon: '5+ years' },
  VFV: { ticker: 'VFV', name: 'Vanguard S&P 500 Index ETF', type: 'etf',
    price: 124.62, change: -0.41, changePercent: -0.33,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture',
    oneLiner: 'Tracks the 500 largest US companies.',
    risk: 'medium', horizon: '5+ years' },
  ZAG: { ticker: 'ZAG', name: 'BMO Aggregate Bond Index ETF', type: 'etf',
    price: 14.21, change: -0.02, changePercent: -0.14,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture',
    oneLiner: 'Canadian bonds for stability.',
    risk: 'lower', horizon: '2+ years' },
  ZSP: { ticker: 'ZSP', name: 'BMO S&P 500 Index ETF', type: 'etf',
    price: 89.15, change: 0.23, changePercent: 0.26,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture',
    oneLiner: 'Another way to own the S&P 500.',
    risk: 'medium', horizon: '5+ years' },
  VEQT: { ticker: 'VEQT', name: 'Vanguard All-Equity ETF Portfolio', type: 'etf',
    price: 41.88, change: 0.09, changePercent: 0.22,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture',
    oneLiner: 'Global stocks, fully diversified.',
    risk: 'medium', horizon: '5+ years' },

  // Canadian stocks
  RY: { ticker: 'RY', name: 'Royal Bank of Canada', type: 'stock',
    price: 165.42, change: 1.18, changePercent: 0.72,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },
  TD: { ticker: 'TD', name: 'Toronto-Dominion Bank', type: 'stock',
    price: 84.31, change: -0.27, changePercent: -0.32,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },
  ENB: { ticker: 'ENB', name: 'Enbridge Inc.', type: 'stock',
    price: 58.04, change: 0.34, changePercent: 0.59,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },
  SHOP: { ticker: 'SHOP', name: 'Shopify Inc.', type: 'stock',
    price: 128.76, change: 2.41, changePercent: 1.91,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },
  BNS: { ticker: 'BNS', name: 'Bank of Nova Scotia', type: 'stock',
    price: 70.55, change: 0.42, changePercent: 0.60,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },

  // Bonds
  GOC10: { ticker: 'GOC10', name: 'Government of Canada 10-Year Bond', type: 'bond',
    price: 98.42, change: 0.05, changePercent: 0.05,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },
  SCOTGIC1: { ticker: 'SCOTGIC1', name: 'Scotia 1-Year Cashable GIC (5.05%)', type: 'bond',
    price: 100.00, change: 0.00, changePercent: 0.00,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },
  SCOTGIC5: { ticker: 'SCOTGIC5', name: 'Scotia 5-Year GIC (4.75%)', type: 'bond',
    price: 100.00, change: 0.00, changePercent: 0.00,
    asOf: '2026-05-23T20:00:00Z', source: 'fixture' },
};

const USE_LIVE_QUOTES = false;

const quoteCache = new Map<string, { quote: Quote; fetchedAt: number }>();
const CACHE_TTL = 60_000;

export async function getQuote(ticker: string): Promise<Quote | null> {
  const key = ticker.toUpperCase();
  const cached = quoteCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return cached.quote;

  const fixture = QUOTE_FIXTURES[key];
  if (!USE_LIVE_QUOTES) {
    if (fixture) quoteCache.set(key, { quote: fixture, fetchedAt: Date.now() });
    return fixture ?? null;
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.TO`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return fixture ?? null;
    const data = await res.json();
    const r = data?.chart?.result?.[0];
    if (!r) return fixture ?? null;
    const meta = r.meta;
    const quote: Quote = {
      ticker: key,
      name: fixture?.name ?? ticker,
      type: fixture?.type ?? 'stock',
      price: meta.regularMarketPrice,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      asOf: new Date(meta.regularMarketTime * 1000).toISOString(),
      source: 'yahoo',
      oneLiner: fixture?.oneLiner,
      risk: fixture?.risk,
      horizon: fixture?.horizon,
    };
    quoteCache.set(key, { quote, fetchedAt: Date.now() });
    return quote;
  } catch {
    return fixture ?? null;
  }
}

export async function getQuotes(tickers: string[]): Promise<Quote[]> {
  const all = await Promise.all(tickers.map(getQuote));
  return all.filter((q): q is Quote => q !== null);
}

export function searchInstruments(query: string): Quote[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();
  return Object.values(QUOTE_FIXTURES)
    .filter(qq =>
      qq.ticker.toLowerCase().includes(q) ||
      qq.name.toLowerCase().includes(q) ||
      qq.type.includes(q))
    .slice(0, 8);
}

// Synchronous helpers for fixture mode (demo)
export function getQuoteSync(ticker: string): Quote | null {
  return QUOTE_FIXTURES[ticker.toUpperCase()] ?? null;
}

export function getQuotesSync(tickers: string[]): Quote[] {
  return tickers.map(t => QUOTE_FIXTURES[t.toUpperCase()]).filter((q): q is Quote => !!q);
}

export const FEED_TICKERS = ['XEQT', 'VFV', 'ZAG', 'ZSP', 'VEQT'];
