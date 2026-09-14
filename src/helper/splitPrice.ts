export function splitPrice(
    price1: number,
    price2: number,
    decimals = 2
  ) {
    const formatted1 = price1.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  
    const formatted2 = price2.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  
    let differenceIndex = 0;
  
    while (
      differenceIndex < formatted1.length &&
      formatted1[differenceIndex] === formatted2[differenceIndex]
    ) {
      differenceIndex++;
    }
  
    return {
      price1: {
        common: formatted1.slice(0, differenceIndex),
        significant: formatted1.slice(differenceIndex),
      },
  
      price2: {
        common: formatted2.slice(0, differenceIndex),
        significant: formatted2.slice(differenceIndex),
      },
    };
  }