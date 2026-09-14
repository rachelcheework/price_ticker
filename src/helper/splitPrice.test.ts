import { describe, expect, it } from "vitest";
import { splitPrice } from "./splitPrice";

describe("splitPrice", () => {
    it("backs up when difference is the last digit", () => {
      const result = splitPrice(57, 58);
  
      expect(result!.price1.significant).toBe("57");
      expect(result!.price2.significant).toBe("58");
    });
  
    it("highlights two digits near the difference", () => {
      const result = splitPrice(123.45, 123.46);
  
      expect(result!.price1.significant).toBe("45");
      expect(result!.price2.significant).toBe("46");
    });
  
    it("handles small decimal prices", () => {
      const result = splitPrice(0.00123, 0.00124);
  
      expect(result!.price1.significant).toBe("23");
      expect(result!.price2.significant).toBe("24");
    });
  
    it("handles integer digit count changing", () => {
      const result = splitPrice(999.99, 1000.01);
  
      expect(result!.price1.significant).toBe("999");
      expect(result!.price2.significant).toBe("1,000");
    });
  });