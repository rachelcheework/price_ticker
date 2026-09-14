//for batch updating UI
import type { PriceQuote } from "../types/marketType";
import { usePriceStore } from "../store/priceStore";

let pendingUpdates: Record<string, PriceQuote> = {};

let frameScheduled = false;

export function queuePriceUpdate(quote: PriceQuote) {
    //eg. "coinbase:BTC/USD" or "kraken:BTC/USD"
    const key = `${quote.provider}:${quote.symbol}`;

    //checking if there is already an update for this instrument waiting to be flushed; is undefined if dont have
    const existingPending = pendingUpdates[key];
    //latest value already in store
    const existingStored =
      usePriceStore.getState().prices[key];
    
    const latestExisting =
      existingPending ?? existingStored;
    
    //stale-update protection
    if (
      latestExisting &&
      quote.timestamp <= latestExisting.timestamp
    ) {
      return;
    }

    pendingUpdates[key] = quote;

    if (frameScheduled) {
        return;
    }

    frameScheduled = true;

    //updating on the next browser frame; can use useInterval to set rate explicitly
    requestAnimationFrame(() => {
        const updates = pendingUpdates;
        pendingUpdates = {};

        usePriceStore
            .getState()
            .updatePrices(updates);

        frameScheduled = false;
    });
}