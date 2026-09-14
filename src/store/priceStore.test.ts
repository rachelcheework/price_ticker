import { beforeEach, describe, expect, it } from "vitest";
import { usePriceStore } from "./priceStore";

describe("priceStore", () => {
  beforeEach(() => {
    usePriceStore.setState({
      prices: {},
    });
  });

  it("adds price updates to the store", () => {
    usePriceStore.getState().updatePrices({
      "Coinbase:BTC/USD": {
        symbol: "BTC/USD",
        provider: "Coinbase",
        bid: 60000,
        ask: 60100,
        timestamp: 1726291200000,
      },
    });

    const prices = usePriceStore.getState().prices;

    expect(prices["Coinbase:BTC/USD"]).toEqual({
      symbol: "BTC/USD",
      provider: "Coinbase",
      bid: 60000,
      ask: 60100,
      timestamp: 1726291200000,
    });
  });

  it("stores quotes from different providers separately", () => {
    usePriceStore.getState().updatePrices({
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
    });

    const prices = usePriceStore.getState().prices;

    expect(prices["Coinbase:BTC/USD"]).toBeDefined();
    expect(prices["Kraken:BTC/USD"]).toBeDefined();

    expect(prices["Coinbase:BTC/USD"].provider).toBe("Coinbase");
    expect(prices["Kraken:BTC/USD"].provider).toBe("Kraken");
  });

  it("updates an existing quote without deleting other quotes", () => {
    usePriceStore.getState().updatePrices({
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
    });

    usePriceStore.getState().updatePrices({
      "Coinbase:BTC/USD": {
        symbol: "BTC/USD",
        provider: "Coinbase",
        bid: 60200,
        ask: 60300,
        timestamp: 1726291202000,
      },
    });

    const prices = usePriceStore.getState().prices;

    expect(prices["Coinbase:BTC/USD"].bid).toBe(60200);

    expect(prices["Kraken:BTC/USD"].bid).toBe(60050);
  });
});