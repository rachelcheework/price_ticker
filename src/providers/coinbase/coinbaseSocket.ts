import { COINBASE_SOCKET_URL, MAX_RECONNECT_DELAY } from "../../constants/constants";
import { queuePriceUpdate } from "../../helper/queuePriceUpdate";
import { normalizeCoinbaseTicker } from "./coinbaseAdaptor";
import { getReconnectDelay } from "../../socketsManagement/getReconnectDelay";
import { usePriceStore } from "../../store/priceStore";
import { COINBASE_SYMBOLS as SYMBOLS } from "./coinbaseSymbols";

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
        connectCoinbaseSocket();
    }, delay);
}

const coinbaseSymbols = SYMBOLS.map((symbol) =>
    symbol.replace("/", "-")
);

export function connectCoinbaseSocket() {
    shouldReconnect = true;
    setConnectionStatus("Coinbase", "connecting");
    //if a websocket already exists/is being created, dont create another one
    if (
        socket?.readyState === WebSocket.OPEN ||
        socket?.readyState === WebSocket.CONNECTING
    ) {
        return;
    }


    const ws = new WebSocket(COINBASE_SOCKET_URL);


    socket = ws;

    ws.onopen = () => {
        reconnectAttempts = 0;

        ws.send(
            JSON.stringify({
                type: "subscribe",
                channels: [

                    {
                        "name": "ticker",
                        "product_ids": coinbaseSymbols
                    }
                ]
            })
        );
    };

    ws.onmessage = (event) => {
        const status =
            usePriceStore.getState()
                .connectionStatus.Coinbase;

        if (status !== "connected") {
            usePriceStore
                .getState()
                .setConnectionStatus(
                    "Coinbase",
                    "connected"
                );
        }
        const message = JSON.parse(event.data);

        // console.log("Incoming raw message:", message);

        //filtering for ticker message only
        if (
            message.type !== "ticker" ||
            !message.product_id
        ) {
            return;
        }

        const quote = normalizeCoinbaseTicker(message);

        queuePriceUpdate(quote);
    };

    ws.onerror = (error) => {
        setConnectionStatus("Coinbase", "error");
        console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
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

export function disconnectCoinbaseSocket() {
    shouldReconnect = false; //dont reconnect if you intentionally close
    setConnectionStatus("Coinbase", "disconnected");

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

