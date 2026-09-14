//socket urls
export const COINBASE_SOCKET_URL = "wss://ws-feed.exchange.coinbase.com";
export const KRAKEN_SOCKET_URL = "wss://ws.kraken.com/v2";
export const BINANCE_SOCKET_URL = "wss://stream.binance.com:9443/ws";

//socket reconnect exponential backoff delay limit
export const MAX_RECONNECT_DELAY = 30_000;