import React, { useMemo, useState } from "react";
import { usePriceStore } from "../store/priceStore";
import { getBestQuotes } from "../helper/getBestQuotes";
import { splitPrice } from "../helper/splitPrice";

type PriceCardProps = {
    symbol: string;
};

type PendingTrade = {
    side: "BUY" | "SELL";
    symbol: string;
    price: number;
    provider: string;
};

export const PriceCard = ({ symbol }: PriceCardProps) => {
    const prices = usePriceStore((state) => state.prices);

    //state for confirmation modal
    const [pendingTrade, setPendingTrade] =
        useState<PendingTrade | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const [tradeError, setTradeError] =
        useState<string | null>(null);


    const [isExecutingTrade, setIsExecutingTrade] =
        useState(false);

    const { bestBid, bestAsk } = useMemo(() => {
        return getBestQuotes(prices, symbol);
    }, [prices, symbol]);

    const handleBidClick = () => {
        if (!bestBid) return;

        setPendingTrade({
            side: "SELL",
            symbol,
            price: bestBid.bid,
            provider: bestBid.provider,
        });
    };

    const handleAskClick = () => {
        if (!bestAsk) return;

        setPendingTrade({
            side: "BUY",
            symbol,
            price: bestAsk.ask,
            provider: bestAsk.provider,
        });
    };

    const handleConfirmTrade = () => {

        setTradeError(null);
        setSuccessMessage(null);
        setIsExecutingTrade(true);

        const providerStatus =
            usePriceStore.getState().connectionStatus[pendingTrade!.provider];

        if (providerStatus !== "connected") {
            setTradeError(
                `${pendingTrade!.provider} is currently unavailable. Please try another provider.`
            );

            setIsExecutingTrade(false);
            return;
        }

        console.log("Simulated trade:", pendingTrade);

        setSuccessMessage(
            `${pendingTrade!.side} ${pendingTrade!.symbol} executed at ${pendingTrade!.price}`
        );

        setPendingTrade(null);
        setIsExecutingTrade(false);

        setTimeout(() => {
            setSuccessMessage(null);
        }, 2000);
    };

    if (!bestBid || !bestAsk) {
        return <div>Loading prices...</div>;
    }

    //for bid/ask/spread/confirmation modal
    const spread = bestAsk.ask - bestBid.bid;

    const highlightedPrices = splitPrice(
        bestBid!.bid,
        bestAsk!.ask
    );

    return (
        <>
            <div className="rounded-xl bg-white/15 border border-white/20 p-5 text-white shadow-md shadow-gray-300/50">
                {/* Header */}
                <h2 className="mb-4 text-lg font-semibold">
                    {symbol}
                </h2>

                {/* Bid / Ask */}
                <div className="grid grid-cols-2 gap-2 md:gap-4">

                    {/* BID */}
                    <button
                        onClick={handleBidClick}
                        className="rounded-lg border p-4 text-left transition cursor-pointer bg-white/90 text-gray-950 hover:bg-white"
                    >
                        <p className="mb-1 text-xs font-medium text-gray-500">
                            BID
                        </p>

                        <p data-testid="best-bid" className="tabular-nums">
                            <span className="text-lg text-gray-400">
                                {highlightedPrices.price1.common}
                            </span>

                            <span className="text-3xl font-bold">
                                {highlightedPrices.price1.significant}
                            </span>
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            {bestBid.provider}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Sell
                        </p>
                    </button>

                    {/* ASK */}
                    <button
                        onClick={handleAskClick}
                        className="rounded-lg border p-4 text-left transition cursor-pointer bg-white/90 text-gray-950 hover:bg-white"
                    >
                        <p className="mb-1 text-xs font-medium text-gray-500">
                            ASK
                        </p>

                        <p data-testid="best-ask" className="tabular-nums">
                            <span className="text-lg text-gray-400">
                                {highlightedPrices.price2.common}
                            </span>

                            <span className="text-3xl font-bold">
                                {highlightedPrices.price2.significant}
                            </span>
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {bestAsk.provider}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            Buy
                        </p>
                    </button>
                </div>

                {/* Spread */}
                <div className="mt-4 border-t pt-3">
                    <div className="flex justify-center text-sm">
                        <span className="text-gray-300">
                            Spread
                        </span>

                        <span className="font-medium tabular-nums">
                            {spread.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Success message */}
                {successMessage && (
                    <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        ✓ {successMessage}
                    </div>
                )}
            </div>

            {/* CONFIRMATION MODAL */}
            {pendingTrade && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-[90%] max-w-sm rounded-xl bg-white p-6 shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                        <h2 className="text-xl font-semibold">
                            Confirm Simulated Trade
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Review the trade before confirming.
                        </p>

                        {/* Trade information */}
                        <div className="mt-5 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Side
                                </span>

                                <span className="font-semibold">
                                    {pendingTrade.side}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Instrument
                                </span>

                                <span data-testid="confirmation-symbol" className="font-semibold">
                                    {pendingTrade.symbol}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Price
                                </span>

                                <span className="font-semibold tabular-nums">
                                    {pendingTrade.price.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span  className="text-gray-500">
                                    Provider
                                </span>

                                <span data-testid="confirmation-provider" className="font-semibold">
                                    {pendingTrade.provider}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setPendingTrade(null)}
                                className="flex-1 rounded-lg border px-4 py-2 hover:bg-black/20"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmTrade}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-white hover:bg-black/80"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PriceCard;