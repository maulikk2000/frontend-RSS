import { calculateUTCOffset } from "./skyUtils";

describe("Sky utilities", () => {
  it("calculateUTCOffset should return a valid offset given valid southern hemisphere long/lat coordinates", () => {
    const result = calculateUTCOffset([151.2099, -33.865143], new Date());
    expect(result).toBe(600);
  });

  it("calculateUTCOffset should return a valid offset given valid Meridian long/lat coordinates", () => {
    const result = calculateUTCOffset([0, 0], new Date());
    expect(result).toBe(0);
  });

  it("calculateUTCOffset should return a valid offset given valid northern hemisphere long/lat coordinates", () => {
    const result = calculateUTCOffset([-122.05264668934885, 37.396483361075454], new Date());
    expect(result).toBe(-420);
  });

  it("calculateUTCOffset should return an error if invalid latitude coordinates", () => {
    try {
      calculateUTCOffset([180, -180], new Date());
    } catch (error) {
      expect(error.message).toBe("invalid coordinates");
    }
  });

  it("calculateUTCOffset should return an error if invalid longitude coordinates", () => {
    try {
      calculateUTCOffset([360, 0], new Date());
    } catch (error) {
      expect(error.message).toBe("invalid coordinates");
    }
  });
});
