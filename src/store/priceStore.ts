//zustand store
import { create } from "zustand";
import { PriceQuote } from "../types/marketType";

type ConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected"
    | "error";

type PriceStore = {
    prices: Record<string, PriceQuote>;
    connectionStatus: Record<string, ConnectionStatus>;

    updatePrices: (
        updates: Record<string, PriceQuote>
    ) => void;
    setConnectionStatus: (
        provider: string,
        status: ConnectionStatus
    ) => void;
};

export const usePriceStore = create<PriceStore>((set) => ({
    prices: {},
    connectionStatus: {},
    updatePrices: (updates) =>
        set((state) => ({
            prices: {
                ...state.prices,
                ...updates,
            },
        })),
    setConnectionStatus: (provider, status) =>
        set((state) => ({
            connectionStatus: {
                ...state.connectionStatus,
                [provider]: status,
            },
        })),
}));