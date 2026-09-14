import React from "react";
import { symbols } from "./constants/symbols";
import PriceCard from "./components/PriceCard";

const PriceTicker = () => {
    return (
        <div className="min-h-screen bg-gray-950">
            <div className="p-4 grid md:grid-cols-3 2xl:grid-cols-4 gap-4">
                {symbols.map((symbol) => (
                    <PriceCard
                        key={symbol}
                        symbol={symbol}
                    />
                ))}
            </div>
        </div>
    );
};

export default PriceTicker;