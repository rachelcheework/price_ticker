//to get best bid and best ask
import type { PriceQuote } from "../types/marketType";

export function getBestQuotes(
  prices: Record<string, PriceQuote>,
  symbol: string
) {
  const quotes = Object.values(prices).filter(
    (price) => price.symbol === symbol
  );

  if (quotes.length === 0) {
    return {
      bestBid: null,
      bestAsk: null,
    };
  }

  const bestBid = quotes.reduce((best, current) =>
    current.bid > best.bid ? current : best
  );

  const bestAsk = quotes.reduce((best, current) =>
    current.ask < best.ask ? current : best
  );

  return {
    bestBid,
    bestAsk,
  };
}