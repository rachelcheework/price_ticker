import type { PriceQuote } from "../../types/marketType";

export type KrakenTickerMessage = {
    channel: "ticker";
    type: "snapshot" | "update";
    data: KrakenTickerData[];
};

type KrakenTickerData = {
    ask: number;
    ask_qty: number;
    bid: number;
    bid_qty: number;
    change: number;
    change_pct: number;
    high: number;
    last: number;
    low: number;
    symbol: string;
    timestamp: string;
    volume: number;
    vwap: number;
};

export function normalizeKrakenTicker(
    message: KrakenTickerMessage
):PriceQuote{

    const ticker = message.data[0];

    return {
        
        symbol: ticker.symbol.replace("-", "/"),
        bid: ticker.bid,
        ask: ticker.ask,
        provider: "Kraken",
        timestamp: Date.now(),
    };
}