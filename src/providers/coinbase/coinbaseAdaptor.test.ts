import { describe, expect, it, vi } from "vitest";
import { CoinbaseTickerMessage, normalizeCoinbaseTicker } from "./coinbaseAdaptor";

describe("normalizeCoinbaseTicker", () => {
    it("normalizes a Coinbase ticker message", () => {
        vi.spyOn(Date, "now").mockReturnValue(1726291200000);

        const message: CoinbaseTickerMessage = {
            type: "ticker",
            product_id: "BTC-USD",
            best_bid: "60000.50",
            best_ask: "60010.25",
        };

        const result = normalizeCoinbaseTicker(message);

        expect(result).toEqual({
            symbol: "BTC/USD",
            provider: "Coinbase",
            bid: 60000.5,
            ask: 60010.25,
            timestamp: 1726291200000,
        });

        vi.restoreAllMocks();
    });
});