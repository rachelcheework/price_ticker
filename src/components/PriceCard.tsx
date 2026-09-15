import React, { useMemo, useState } from "react";
import { usePriceStore } from "../store/priceStore";
import { getBestQuotes } from "../helper/getBestQuotes";
import { formatCryptoPrice, formatSpread } from "../helper/formatCryptoPrice";

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
    const [tradeAmount, setTradeAmount] = useState("");

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


        const amount = Number(tradeAmount);

        if (!Number.isFinite(amount) || amount <= 0) {
            setTradeError("Please enter a valid trade amount.");
            return;
        }

        const providerStatus =
            usePriceStore.getState().connectionStatus[pendingTrade!.provider];

        if (providerStatus !== "connected") {
            setTradeError(
                `${pendingTrade!.provider} is currently unavailable. Please try another provider.`
            );

            setIsExecutingTrade(false);
            return;
        }

        console.log("Simulated trade:", { ...pendingTrade, amount });

        setSuccessMessage(
            `${pendingTrade!.side} ${amount} ${pendingTrade!.symbol} executed at ${pendingTrade!.price}`
        );

        setPendingTrade(null);
        setTradeAmount("");
        setIsExecutingTrade(false);

        setTimeout(() => {
            setSuccessMessage(null);
        }, 2000);
    };

    const handleCancel = () => {
        setPendingTrade(null);
        setTradeAmount("");
        setIsExecutingTrade(false);
        setTradeError("")
    }

    if (!bestBid || !bestAsk) {
        return (
            <div className="flex flex-col min-h-58.75 rounded-xl bg-white/15 border border-white/20 p-5 text-white shadow-md shadow-gray-300/50">
                <h2 className="mb-4 text-lg font-semibold">
                    {symbol}
                </h2>

                <div className="flex flex-1 items-center justify-center">
                    <span className="text-sm text-gray-400">
                        No quote available
                    </span>
                </div>
            </div>
        );
    }

    //for bid/ask/spread/confirmation modal
    const spread =
    bestBid && bestAsk
      ? bestAsk.ask - bestBid.bid
      : null;

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
                        className="rounded-lg p-4 text-left transition cursor-pointer bg-[#DD534B] text-gray-950 hover:outline-2 hover:outline-white"
                    >
                        <p className="mb-1 text-xs font-medium text-gray-950">
                            BID
                        </p>

                        <p data-testid="best-bid" className="tabular-nums">

                            <span className="text-white text-2xl font-bold">
                                {formatCryptoPrice(bestBid.bid)}
                            </span>
                        </p>

                        <p className="mt-1 text-sm font-bold text-white">
                            {bestBid.provider}
                        </p>

                        <p className="mt-2 text-xs text-gray-950">
                            Sell
                        </p>
                    </button>

                    {/* ASK */}
                    <button
                        onClick={handleAskClick}
                        className="rounded-lg border p-4 text-left transition cursor-pointer bg-[#4D72E4] text-gray-950 hover:outline-2 hover:outline-white"
                    >
                        <p className="mb-1 text-xs font-medium text-gray-950">
                            ASK
                        </p>

                        <p data-testid="best-ask" className="tabular-nums">

                            <span className="text-2xl text-white font-bold">
                                {formatCryptoPrice(bestAsk.ask)}
                            </span>

                        </p>
                        <p className="mt-1 text-sm font-bold text-white">
                            {bestAsk.provider}
                        </p>

                        <p className="mt-2 text-xs text-gray-950">
                            Buy
                        </p>
                    </button>
                </div>

                {/* Spread */}
                <div className="mt-4 border-t pt-3">
                    <div className="flex justify-center text-sm gap-2">
                        <span className="text-gray-300">
                            Spread
                        </span>

                        <span className="font-medium tabular-nums">
                            {formatSpread(spread!)}
                        </span>
                    </div>
                </div>

                {/* Success message */}
                {successMessage && (
                    <div data-testid="trade-success" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 wrap-break-word">
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
                                <span className="text-gray-500">
                                    Provider
                                </span>

                                <span data-testid="confirmation-provider" className="font-semibold">
                                    {pendingTrade.provider}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="w-1/3 text-gray-500">
                                    Amount
                                </span>

                                <input
                                    id="trade-amount"
                                    data-testid="trade-amount"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-1/2 rounded-lg py-2 text-right tabular-nums bg-black/10 focus:outline-none focus:ring-1 focus:ring-black/50"
                                />
                            </div>

                            <div className="flex justify-between">
                                <span className="w-1/3 text-gray-500">
                                    Estimated Value
                                </span>
                                <span className="w-2/3 truncate text-right font-semibold tabular-nums">
                                    {(
                                        (Number(tradeAmount) || 0) * pendingTrade.price
                                    ).toLocaleString()}
                                </span>

                            </div>

                            {tradeError && (
                                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                                    {tradeError}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 rounded-lg border px-4 py-2 hover:bg-black/20 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmTrade}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-white hover:bg-black/80 cursor-pointer"
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