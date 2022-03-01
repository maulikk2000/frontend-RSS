import { commaDelimiter } from "../strings";

describe("Configurator Page Utilities - Number Comma Delimiter Regex", () => {
  it("Should delimit 100000 into 100,000", () => {
    const value: string = "100000";
    const result = commaDelimiter(value);
    expect(result).toEqual("100,000");
  });

  it("Should delimit 1000000 into 1,000,000", () => {
    const value: string = "1000000";
    const result = commaDelimiter(value);
    expect(result).toEqual("1,000,000");
  });

  it("Should delimit 1000000000000 into 1,000,000,000,000", () => {
    const value: string = "1000000000000";
    const result = commaDelimiter(value);
    expect(result).toEqual("1,000,000,000,000");
  });
});
