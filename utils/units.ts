import { FormattingEnum } from "./constants";
import { percentage, toDecimalPlace } from "./strings";

export const incalculableUnits = (result: string): boolean => {
  if (result === "-1" || result === "-100 %") {
    return true;
  } else {
    return false;
  }
};

export const formatDataForDisplay = (
  format: FormattingEnum,
  value: any,
  decimalPlace: number = format === FormattingEnum.Percentage ? 1 : 2
): string => {
  switch (format) {
    case FormattingEnum.SquareFeet:
      return incalculableUnits(toDecimalPlace(value, decimalPlace))
        ? "N/A"
        : toDecimalPlace(value, decimalPlace) + " ft²";
    case FormattingEnum.SquareMeter:
      return incalculableUnits(toDecimalPlace(value, decimalPlace))
        ? "N/A"
        : toDecimalPlace(value, decimalPlace) + " m²";
    case FormattingEnum.Percentage:
      return incalculableUnits(percentage(value, 1, decimalPlace).toString())
        ? "N/A"
        : percentage(value, 1, decimalPlace).toString();
    case FormattingEnum.Acres:
      return incalculableUnits(toDecimalPlace(value, decimalPlace))
        ? "N/A"
        : toDecimalPlace(ftSqToAcres(value), decimalPlace) + " ac";
    case FormattingEnum.Hectares:
      return incalculableUnits(toDecimalPlace(value, decimalPlace))
        ? "N/A"
        : toDecimalPlace(ftSqToHectares(value), decimalPlace) + " ha";
    case FormattingEnum.Decimal:
      return incalculableUnits(toDecimalPlace(value, decimalPlace)) ? "N/A" : toDecimalPlace(value, decimalPlace);
    case FormattingEnum.Meter:
      return incalculableUnits(toDecimalPlace(value, decimalPlace))
        ? "N/A"
        : toDecimalPlace(value, decimalPlace) + " m";
    case FormattingEnum.Feet:
      return incalculableUnits(toDecimalPlace(value, decimalPlace))
        ? "N/A"
        : toDecimalPlace(value, decimalPlace) + " ft";
    default:
      return value;
  }
};

export const appendUnitFormat = (format: FormattingEnum) => {
  switch (format) {
    case FormattingEnum.SquareFeet:
      return ` ${measurementUnitDisplay[FormattingEnum.SquareFeet]}`;
    case FormattingEnum.SquareMeter:
      return ` ${measurementUnitDisplay[FormattingEnum.SquareMeter]}`;
    case FormattingEnum.Percentage:
      return ` ${measurementUnitDisplay[FormattingEnum.Percentage]}`;
    case FormattingEnum.Acres:
      return ` ${measurementUnitDisplay[FormattingEnum.Acres]}`;
    case FormattingEnum.Hectares:
      return ` ${measurementUnitDisplay[FormattingEnum.Hectares]}`;
    case FormattingEnum.Meter:
      return ` ${measurementUnitDisplay[FormattingEnum.Meter]}`;
    case FormattingEnum.Feet:
      return ` ${measurementUnitDisplay[FormattingEnum.Feet]}`;
    case FormattingEnum.Decimal:
    default:
      return `${measurementUnitDisplay[FormattingEnum.None]}`;
  }
};

export const measurementUnitDisplay: Record<FormattingEnum, string> = {
  [FormattingEnum.SquareFeet]: "ft²",
  [FormattingEnum.SquareMeter]: "m²",
  [FormattingEnum.Acres]: "ac",
  [FormattingEnum.Hectares]: "ha",
  [FormattingEnum.Percentage]: "%",
  [FormattingEnum.Decimal]: "",
  [FormattingEnum.Feet]: "ft",
  [FormattingEnum.Meter]: "m",
  [FormattingEnum.None]: ""
};

export const ftSqToAcres = (ftSq: number) => {
  return ftSq * 0.000023;
};

export const ftSqToHectares = (ftSq: number) => {
  return ftSq * 0.0000092903;
};
