import type { PriceQuote } from "../../types/marketType";

export type BinanceTickerMessage = {
    u: number;
    s: string;
    b: string;
    B: string;
    a: string;
    A: string;
};

function normalizeBinanceSymbol(symbol: string) {
    if (symbol.endsWith("USDT")) {
        const base = symbol.slice(0, -4);

        return `${base}/USD`;
    }

    return symbol;
}

export const normalizeBinanceTicker = (
    message: BinanceTickerMessage
): PriceQuote => {
    return {
        symbol: normalizeBinanceSymbol(message.s),
        bid: Number(message.b),
        ask: Number(message.a),
        provider: "Binance",
        timestamp: Date.now(),
    };
};