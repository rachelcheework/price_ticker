//reusable component to execute dummy trade
import React from "react";
import { useState } from "react";
import type { PriceQuote } from "../types/marketType";

type TradeControlsProps = {
  price: PriceQuote;
};

type TradeSide = "buy" | "sell";

const TradeControls = ({ price }: TradeControlsProps) => {
  const [amount, setAmount] = useState("");
  const [tradeMessage, setTradeMessage] = useState("");

  const executeTrade = (side: TradeSide) => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setTradeMessage("Please enter a valid amount.");
      return;
    }

    const executionPrice =
      side === "buy"
        ? price.ask
        : price.bid;

    const total = numericAmount * executionPrice;

    setTradeMessage(
      `${side.toUpperCase()} ${numericAmount} ${price.symbol} @ ${executionPrice.toLocaleString()} via ${price.provider}. Total: $${total.toLocaleString()}`
    );
  };

  return (
    <div>
      <label>
        Trade amount
      </label>

      <input
        type="number"
        min="0"
        step="any"
        value={amount}
        onChange={(event) =>
          setAmount(event.target.value)
        }
        placeholder="e.g. 0.5"
      />

      <div>
        <button
          type="button"
          onClick={() => executeTrade("sell")}
        >
          Sell @ {price.bid.toLocaleString()}
        </button>

        <button
          type="button"
          onClick={() => executeTrade("buy")}
        >
          Buy @ {price.ask.toLocaleString()}
        </button>
      </div>

      {tradeMessage && (
        <p>{tradeMessage}</p>
      )}
    </div>
  );
};

export default TradeControls;