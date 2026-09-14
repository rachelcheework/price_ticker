//this is to normalise data from api; to use with the adaptors
export type PriceQuote = {
    symbol: string;
    bid: number;
    ask: number;
    // provider: string;
    provider: "Coinbase" | "Kraken" | "Binance";
    timestamp: number;
  };


