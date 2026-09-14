import { describe, expect, it, vi } from "vitest";
import { KrakenTickerMessage, normalizeKrakenTicker } from "./krakenAdaptor";

describe("normalizeKrakenTicker", () => {
  it("normalizes a Kraken ticker message", () => {
    vi.spyOn(Date, "now").mockReturnValue(1726291200000);

    const message: KrakenTickerMessage = {
      channel: "ticker",
      type: "update",
      data: [
        {
          symbol: "BTC/USD",
          bid: 60050,
          ask: 60080,

          //these fields are not relevant
          ask_qty: 0,
          bid_qty: 0,
          change: 0,
          change_pct: 0,
          high: 0,
          last: 0,
          low: 0,
          timestamp: "",
          volume: 0,
          vwap: 0
        },
      ],
    };

    const result = normalizeKrakenTicker(message);

    expect(result).toEqual({
      symbol: "BTC/USD",
      provider: "Kraken",
      bid: 60050,
      ask: 60080,
      timestamp: 1726291200000,
    });

    vi.restoreAllMocks();
  });
});