export function formatCryptoPrice(price: number) {
    if (price >= 1000) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  
    if (price >= 1) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
    }
  
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    });
  }

  export function formatSpread(spread: number) {
    if (spread >= 1) {
      return spread.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  
    if (spread >= 0.01) {
      return spread.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
    }
  
    return spread.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    });
  }