import { FormattingEnum } from "utils/constants";
import { formatDataForDisplay } from "../units";

describe("Utilities - Number formatting", () => {
  it("should format percentage with default decimal", () => {
    const formatted = formatDataForDisplay(FormattingEnum.Percentage, 0.2012345);
    expect(formatted).toBe("20.1 %");
  });

  it("should format percentage with specified decimal", () => {
    const formatted = formatDataForDisplay(FormattingEnum.Percentage, 0.2012345, 0);
    expect(formatted).toBe("20 %");
  });

  it("should format square feet with default decimal", () => {
    const formatted = formatDataForDisplay(FormattingEnum.SquareFeet, 123.12345);
    expect(formatted).toBe("123.12 ft²");
  });

  it("should format square feet with specified decimal", () => {
    const formatted = formatDataForDisplay(FormattingEnum.SquareFeet, 123.12345, 0);
    expect(formatted).toBe("123 ft²");
  });

  it("should convert from sqft and format acres with default decimal", () => {
    const formatted = formatDataForDisplay(FormattingEnum.Acres, 172000);
    expect(formatted).toBe("3.96 ac");
  });

  it("should convert from sqft and format square feet with specified decimal", () => {
    const formatted = formatDataForDisplay(FormattingEnum.Acres, 172000, 3);
    expect(formatted).toBe("3.956 ac");
  });

  it("should return N/A when -1 square feet", () => {
    const formatted = formatDataForDisplay(FormattingEnum.SquareFeet, -1);
    expect(formatted).toBe("N/A");
  });

  it("should return N/A when -1 percentage", () => {
    const formatted = formatDataForDisplay(FormattingEnum.Percentage, -1);
    expect(formatted).toBe("N/A");
  });

  it("should return 0 when no percentage", () => {
    const formatted = formatDataForDisplay(FormattingEnum.Percentage, null);
    expect(formatted).toBe("0");
  });
});
