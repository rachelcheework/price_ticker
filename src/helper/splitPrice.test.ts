import { describe, expect, it } from "vitest";
import { splitPrice } from "./splitPrice";

describe("splitPrice", () => {
  it("splits two prices into common and significant parts", () => {
    const result = splitPrice(12.34, 12.56);

    expect(result).toEqual({
      price1: {
        common: "12.",
        significant: "34",
      },
      price2: {
        common: "12.",
        significant: "56",
      },
    });
  });

  it("returns the whole price as common when both prices are the same", () => {
    const result = splitPrice(12.34, 12.34);

    expect(result).toEqual({
      price1: {
        common: "12.34",
        significant: "",
      },
      price2: {
        common: "12.34",
        significant: "",
      },
    });
  });

  it("handles prices that differ in the integer portion", () => {
    const result = splitPrice(12.34, 13.34);

    expect(result).toEqual({
      price1: {
        common: "1",
        significant: "2.34",
      },
      price2: {
        common: "1",
        significant: "3.34",
      },
    });
  });

  it("uses the specified number of decimal places", () => {
    const result = splitPrice(12.3456, 12.3499, 3);

    expect(result).toEqual({
      price1: {
        common: "12.3",
        significant: "46",
      },
      price2: {
        common: "12.3",
        significant: "50",
      },
    });
  });
});