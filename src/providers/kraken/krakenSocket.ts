import { KRAKEN_SOCKET_URL, MAX_RECONNECT_DELAY } from "../../constants/constants";
import { queuePriceUpdate } from "../../helper/queuePriceUpdate";
import { normalizeKrakenTicker } from "./krakenAdaptor";
import { getReconnectDelay } from "../../socketsManagement/getReconnectDelay";
import { usePriceStore } from "../../store/priceStore";
import { KRAKEN_SYMBOLS as SYMBOLS } from "./krakenSymbols";

//socket -> shared reference
let socket: WebSocket | null = null;

let reconnectAttempts = 0;
let shouldReconnect = true;

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const setConnectionStatus =
  usePriceStore.getState().setConnectionStatus;

function scheduleReconnect() {
    if (reconnectTimer) return;

    const delay = getReconnectDelay(
        reconnectAttempts,
        MAX_RECONNECT_DELAY
    );

    reconnectAttempts++;

    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectKrakenSocket();
    }, delay);
}

export function connectKrakenSocket() {
    shouldReconnect = true;
    setConnectionStatus("Kraken", "connecting");
    //if a websocket already exists/is being created, dont create another one
    if (
        socket?.readyState === WebSocket.OPEN ||
        socket?.readyState === WebSocket.CONNECTING
    ) {
        return;
    }


    const ws = new WebSocket(KRAKEN_SOCKET_URL);


    socket = ws;

    ws.onopen = () => {
        reconnectAttempts = 0;

        ws.send(
            JSON.stringify({
                method: "subscribe",
                params: {
                    channel: "ticker",
                    symbol: SYMBOLS,
                    event_trigger: "bbo",
                },
            })
        );
    };

    ws.onmessage = (event) => {
        const status =
            usePriceStore.getState()
                .connectionStatus.Binance;

        if (status !== "connected") {
            usePriceStore
                .getState()
                .setConnectionStatus(
                    "Kraken",
                    "connected"
                );
        }
        const message = JSON.parse(event.data);

        // console.log("Incoming raw message:", message);

        //filtering for ticker message only
        if (
            message.channel !== "ticker"
        ) {
            return;
        }

        const quote = normalizeKrakenTicker(message);

        queuePriceUpdate(quote);
    };

    ws.onerror = (error) => {
        setConnectionStatus("Kraken", "error");
        console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
        setConnectionStatus("Kraken", "disconnected");
        console.log("WebSocket disconnected");
        if (socket === ws) {
            socket = null;
        }
        if (shouldReconnect) {
            scheduleReconnect();
        }
    };

    return socket;
}

export function disconnectKrakenSocket() {
    shouldReconnect = false; //dont reconnect if you intentionally close

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    const ws = socket;

    if (!ws) return;

    if (ws.readyState === WebSocket.OPEN) {
        ws.close();
    }

    if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener(
            "open",
            () => ws.close(),
            { once: true } //removes listener automatically
        );
    }

    //clearing the shared socket reference
    if (socket === ws) {
        socket = null;
    }
}

