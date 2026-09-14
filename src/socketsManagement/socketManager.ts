import { connectCoinbaseSocket, disconnectCoinbaseSocket } from "../providers/coinbase/coinbaseSocket";
import { connectKrakenSocket, disconnectKrakenSocket } from "../providers/kraken/krakenSocket";
import { connectBinanceSocket, disconnectBinanceSocket } from "../providers/binance/binanceSocket";

export function connectPriceSockets() {
    connectCoinbaseSocket();
    connectKrakenSocket();
    connectBinanceSocket();
  }
  
  export function disconnectPriceSockets() {
    disconnectCoinbaseSocket();
    disconnectKrakenSocket();
    disconnectBinanceSocket();
  }