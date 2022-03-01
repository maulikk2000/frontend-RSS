// This delimits all numbers xxx,xxx,xxx.xx etc
// Test has been added to utils.test.tsx
export const commaDelimiter = (value: string) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const zeroPad = (num, places) => String(num).padStart(places, "0");

export const percentage = (item: number, total: number, decimalPlace: number = 0) => {
  if (!item) {
    return 0;
  } else {
    let result: number = (item / total) * 100;
    let stringResult: string = result.toString();
    if (result % 1 !== 0) {
      stringResult = result.toFixed(decimalPlace);
    }
    if (result !== 0) {
      return `${stringResult} %`;
    } else {
      return stringResult;
    }
  }
};

export const toDecimalPlace = (item: number | string | undefined, decimalPlace: number) => {
  if (!item || typeof item === "string") {
    return "-";
  } else {
    let stringResult: string = item.toString();
    if (item % 1 !== 0) {
      stringResult = item.toFixed(decimalPlace);
    }
    var decimalZeros = "";
    for (let i = 0; i < decimalPlace; i++) {
      decimalZeros += "0";
    }
    let decimalPlaceItem = commaDelimiter(stringResult);
    if (decimalPlaceItem.split(".")[1] === decimalZeros) {
      return decimalPlaceItem.split(".")[0];
    } else {
      return decimalPlaceItem;
    }
  }
};
