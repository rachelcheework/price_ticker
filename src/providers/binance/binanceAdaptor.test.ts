import { describe, expect, it, vi } from "vitest";
import {
  BinanceTickerMessage,
  normalizeBinanceTicker,
} from "./binanceAdaptor";

describe("normalizeBinanceTicker", () => {
  it("normalizes a Binance ticker message", () => {
    vi.spyOn(Date, "now").mockReturnValue(1726291200000);

    const message: BinanceTickerMessage = {
      u: 123456789,
      s: "BTCUSDT",
      b: "60050.00",
      B: "1.25",
      a: "60080.00",
      A: "0.85",
    };

    const result = normalizeBinanceTicker(message);

    expect(result).toEqual({
      symbol: "BTC/USD",
      bid: 60050,
      ask: 60080,
      provider: "Binance",
      timestamp: 1726291200000,
    });

    vi.restoreAllMocks();
  });
});