import type { PriceQuote } from "../../types/marketType";

export type CoinbaseTickerMessage = {
    type: "ticker";
    product_id: string;
    best_bid: string;
    best_ask: string;
  };
  
  export const normalizeCoinbaseTicker = (
    message: CoinbaseTickerMessage
  ): PriceQuote => {
    return {
      symbol: message.product_id
      .replace("-", "/")
      .replace("USDT", "USD"),
      bid: Number(message.best_bid),
      ask: Number(message.best_ask),
      provider: "Coinbase",
      timestamp: Date.now(),
    };
  };