import { render, screen } from "@testing-library/react";
import { SummaryItem } from "./SummaryItem";

describe("SummaryItem", () => {
  it("should display value without metric", () => {
    render(<SummaryItem name="Example A" value="305.50" />);
    expect(screen.getByText("Example A", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("305.50", { exact: false })).toBeInTheDocument();
  });

  it("should display correctly with metric", () => {
    render(<SummaryItem name="Example A" value="305.50" metric="ft" />);
    expect(screen.getByText("Example A", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("305.50", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("ft", { exact: false })).toBeInTheDocument();
  });
});
