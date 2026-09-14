import { describe, expect, it } from "vitest";
import { getBestQuotes } from "./getBestQuotes";
import type { PriceQuote } from "../types/marketType";

describe("getBestQuotes", () => {
    it("returns the highest bid and lowest ask for the requested symbol", () => {
        const prices: Record<string, PriceQuote> = {
            "Coinbase:BTC/USD": {
                symbol: "BTC/USD",
                provider: "Coinbase",
                bid: 60000,
                ask: 60100,
                timestamp: 1726291200000
            },
            "Kraken:BTC/USD": {
                symbol: "BTC/USD",
                provider: "Kraken",
                bid: 60050,
                ask: 60080,
                timestamp: 1726291201000
            },
        };

        const { bestBid, bestAsk } = getBestQuotes(prices, "BTC/USD");

        expect(bestBid?.bid).toBe(60050);
        expect(bestBid?.provider).toBe("Kraken");

        expect(bestAsk?.ask).toBe(60080);
        expect(bestAsk?.provider).toBe("Kraken");
    });


    it("only compares quotes for the requested symbol", () => {
        const prices: Record<string, PriceQuote> = {
            "Coinbase:BTC/USD": {
                symbol: "BTC/USD",
                provider: "Coinbase",
                bid: 60000,
                ask: 60100,
                timestamp: 1726291200000,
            },

            "Kraken:BTC/USD": {
                symbol: "BTC/USD",
                provider: "Kraken",
                bid: 60050,
                ask: 60080,
                timestamp: 1726291201000,
            },

            "Coinbase:ETH/USD": {
                symbol: "ETH/USD",
                provider: "Coinbase",
                bid: 999999,
                ask: 1,
                timestamp: 1726291202000,
            },
        };

        const { bestBid, bestAsk } = getBestQuotes(prices, "BTC/USD");

        expect(bestBid?.bid).toBe(60050);
        expect(bestAsk?.ask).toBe(60080);
    });

    it("works when only one provider has a quote", () => {
        const prices: Record<string, PriceQuote> = {
            "Coinbase:BTC/USD": {
                symbol: "BTC/USD",
                provider: "Coinbase",
                bid: 60000,
                ask: 60100,
                timestamp: 1726291200000,
            },
        };

        const { bestBid, bestAsk } = getBestQuotes(prices, "BTC/USD");

        expect(bestBid?.bid).toBe(60000);
        expect(bestBid?.provider).toBe("Coinbase");

        expect(bestAsk?.ask).toBe(60100);
        expect(bestAsk?.provider).toBe("Coinbase");
    });

    it("returns no best bid or ask when no quotes exist", () => {
        const prices: Record<string, PriceQuote> = {};

        const { bestBid, bestAsk } = getBestQuotes(prices, "BTC/USD");

        expect(bestBid).toBeNull();
        expect(bestAsk).toBeNull();
    });
});
