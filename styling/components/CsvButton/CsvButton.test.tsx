import { render, screen } from "@testing-library/react";
import CsvButton from "./CsvButton";

describe("the download csv button", () => {
  it("Should have the following text: Export CSV", () => {
    render(<CsvButton data={[[]]} filename="test" />);
    const csvBtn = screen.getByText("Export CSV");
    expect(csvBtn).toBeInTheDocument();
  });
});
