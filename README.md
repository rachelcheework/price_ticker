## Approach and Architecture

I built the application as a client-side React/TypeScript price ticker that consumes real-time market data from multiple public WebSocket APIs.

Rather than coupling the UI directly to each provider's message format, I separated the application into several layers:

**WebSocket providers → provider adapters → normalized price updates → batching layer → Zustand store → React UI**

Each exchange maintains its own WebSocket connection and provider-specific logic. Incoming messages are passed through an adapter that converts the exchange-specific payload into a common `PriceQuote` structure containing the symbol, bid, ask, provider and timestamp.

This is so that the rest of the application does not need to know whether a quote came from Coinbase, Kraken or Binance, and additional providers can be added by implementing another adaptor instead of changing the UI or core state management.

Prices are stored using a composite key such as:

`Coinbase:BTC/USD`

This allows multiple providers to maintain independent quotes for the same instrument. The application can then compare those quotes and determine the **highest bid** and **lowest ask**, and display the corresponding providers.

## Handling Real-Time Updates

One of the main considerations was handling a potentially high volume of WebSocket messages without causing unnecessary React renders.

Instead of updating the Zustand store for every incoming network message, price updates are passed through a batching layer using `requestAnimationFrame`. The latest update for each provider/instrument is collected and written to the store together on the next animation frame.

This separates the **network update frequency** from the **UI render frequency**, allowing the application to receive frequent updates while keeping rendering smooth.

Zustand is used as the shared market-data store because it provides lightweight state management and allows components to subscribe to the data they need without tying the WebSocket lifecycle to React components.

## Connection Management

Each WebSocket connection is managed independently.

The connection logic handles connection status, disconnections and automatic reconnection using exponential backoff. This means a failure from one provider does not prevent prices from the remaining providers from continuing to update.

Keeping the WebSocket logic outside React components also avoids recreating connections during component renders and keeps networking concerns separate from presentation logic.

## Trade Flow and UI

For each instrument, the application displays the best available bid and ask together with the corresponding providers.

Users can select a BUY or SELL price, enter an amount and confirm a dummy trade. The trade does not communicate with an exchange; it simply demonstrates how the displayed market data could be used as the execution price in a trading workflow.

The interface was intentionally kept simple so that the most important information — instrument, bid, ask, provider and connection state — remains easy to scan while prices are updating rapidly.

## Testing

I added tests around the main UI behaviour using Vitest and React Testing Library, including rendering instrument information and verifying that bid/ask values derived from the price store are displayed correctly.

The architecture also keeps functions such as quote normalization and best-price selection separate from the UI, making them easier to test independently.

## What I Would Improve With More Time

With more time, I would extend the application with:

* Price change direction so that it is easier to identify market movements
* A modal showing the connection status of each provider
* Better accessibility and responsive-design improvements
* Implement a library like RxJS if stream complexity increased

