import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PriceCard from "./PriceCard";
import { usePriceStore } from "../store/priceStore";


describe("PriceCard", () => {
    beforeEach(() => {
        usePriceStore.setState({
            prices: {},
        });
    });
    afterEach(() => {
        cleanup();
    });

    it("displays the symbol", () => {
        usePriceStore.setState({
            prices: {
              "coinbase:BTC/USD": {
                symbol: "BTC/USD",
                provider: "Coinbase",
                bid: 60000,
                ask: 60100,
                timestamp: 1726291200000,
              },
            },
          });

        render(<PriceCard symbol="BTC/USD" />);

        expect(screen.getByText("BTC/USD")).toBeInTheDocument();
    });

    it("displays the best bid and ask", () => {
        usePriceStore.setState({
            prices: {
                "coinbase:BTC/USD": {
                    symbol: "BTC/USD",
                    provider: "Coinbase",
                    bid: 60000,
                    ask: 60100,
                    timestamp: 1726291200000,
                },

                "kraken:BTC/USD": {
                    symbol: "BTC/USD",
                    provider: "Kraken",
                    bid: 60050,
                    ask: 60080,
                    timestamp: 1726291201000,
                },
            },
        });

        render(<PriceCard symbol="BTC/USD" />);


        expect(screen.getByText("BTC/USD")).toBeInTheDocument();

        expect(screen.getByTestId("best-bid"))
            .toHaveTextContent("60,050");

        expect(screen.getByTestId("best-ask"))
            .toHaveTextContent("60,080");
    });
});
describe("PriceCard trade confirmation", () => {
  beforeEach(() => {
    usePriceStore.setState({
      prices: {
        "coinbase:BTC/USD": {
          symbol: "BTC/USD",
          provider: "Coinbase",
          bid: 60000,
          ask: 60100,
          timestamp: 1726291200000,
        },

        "kraken:BTC/USD": {
          symbol: "BTC/USD",
          provider: "Kraken",
          bid: 60050,
          ask: 60080,
          timestamp: 1726291201000,
        },
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("opens the confirmation modal when BUY is clicked", async () => {
    const user = userEvent.setup();

    render(<PriceCard symbol="BTC/USD" />);

    const buyButton = screen.getByRole("button", {
      name: /buy/i,
    });

    await user.click(buyButton);

    expect(
      screen.getByText(/confirm simulated trade/i)
    ).toBeInTheDocument();
  });

  it("shows the correct trade details in the BUY confirmation modal", async () => {
    const user = userEvent.setup();

    render(<PriceCard symbol="BTC/USD" />);

    await user.click(
      screen.getByRole("button", {
        name: /buy/i,
      })
    );

    expect(screen.getByTestId("confirmation-symbol"))
    .toHaveTextContent("BTC/USD");

    expect(screen.getByTestId("confirmation-provider"))
    .toHaveTextContent("Kraken");
}); 

  it("closes the confirmation modal when Cancel is clicked", async () => {
    const user = userEvent.setup();

    render(<PriceCard symbol="BTC/USD" />);

    await user.click(
      screen.getByRole("button", {
        name: /buy/i,
      })
    );

    expect(
      screen.getByText(/confirm simulated trade/i)
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(
      screen.queryByText(/confirm simulated trade/i)
    ).not.toBeInTheDocument();
  });

  it("resets the pending trade after Cancel", async () => {
    const user = userEvent.setup();
  
    render(<PriceCard symbol="BTC/USD" />);
  
    await user.click(
      screen.getByRole("button", { name: /buy/i })
    );
  
    expect(
      screen.getByText(/confirm simulated trade/i)
    ).toBeInTheDocument();
  
    await user.click(
      screen.getByRole("button", { name: /cancel/i })
    );
  
    expect(
      screen.queryByText(/confirm simulated trade/i)
    ).not.toBeInTheDocument();
  
    // Open it again to prove state was cleared properly
    await user.click(
      screen.getByRole("button", { name: /buy/i })
    );
  
    expect(screen.getByTestId("trade-amount"))
    .toHaveValue(null);
  });

 });



