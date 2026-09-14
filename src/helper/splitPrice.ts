export function splitPrice(
    price1: number,
    price2: number,
) {
    const formatted1 = price1.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      });
    
      const formatted2 = price2.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      });
    
      const raw1 = price1.toString();
      const raw2 = price2.toString();
    
      const [integer1] = raw1.split(".");
      const [integer2] = raw2.split(".");
    
      // Edge case:
      // 999.99 vs 1000.01
      // Integer digit count changed.
      if (integer1.length !== integer2.length) {
        const decimalIndex1 = formatted1.indexOf(".");
        const decimalIndex2 = formatted2.indexOf(".");
    
        const end1 =
          decimalIndex1 === -1
            ? formatted1.length
            : decimalIndex1;
    
        const end2 =
          decimalIndex2 === -1
            ? formatted2.length
            : decimalIndex2;
    
        return {
          price1: {
            common: "",
            significant: formatted1.slice(0, end1),
            remainder: formatted1.slice(end1),
          },
    
          price2: {
            common: "",
            significant: formatted2.slice(0, end2),
            remainder: formatted2.slice(end2),
          },
        };
      }
    
      // Normal case:
      // compare formatted strings
      let differenceIndex = 0;
    
      while (
        differenceIndex < formatted1.length &&
        differenceIndex < formatted2.length &&
        formatted1[differenceIndex] === formatted2[differenceIndex]
      ) {
        differenceIndex++;
      }
    
      // an array of the indexes of the actual digits and not the decimal
      const digitIndexes = [...formatted1]
        .map((char, index) =>
          /\d/.test(char) ? index : -1
        )
        .filter((index) => index !== -1);
    
      // find first digit at or after the difference; >= is because differenceIndex might be a punctuation
      let differingDigit = digitIndexes.findIndex(
        (index) => index >= differenceIndex
      );
    
      //if the differing digit is at the end, move back one position
      if (differingDigit === -1) {
        differingDigit = digitIndexes.length - 1;
      }
    
      // make sure we always display 2 digits
      const startDigit = Math.min(
        differingDigit,
        Math.max(0, digitIndexes.length - 2)
      );
    
      const endDigit = Math.min(
        startDigit + 1,
        digitIndexes.length - 1
      );

      const startIndex = digitIndexes[startDigit];
      const endIndex = digitIndexes[endDigit] + 1;

      return {
        price1: {
          common: formatted1.slice(0, startIndex),
          significant: formatted1.slice(
            startIndex,
            endIndex
          ),
          remainder: formatted1.slice(endIndex),
        },
    
        price2: {
          common: formatted2.slice(0, startIndex),
          significant: formatted2.slice(
            startIndex,
            endIndex
          ),
          remainder: formatted2.slice(endIndex),
        },
      };
    };