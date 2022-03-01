import { render, screen } from "@testing-library/react";
import { Header } from "./Headers";

describe("Headers", () => {
  it("Should have the following text: Header 1", () => {
    render(<Header type={"H1"} title={"Header 1"} />);
    const headerNode = screen.getByText("Header 1");
    expect(headerNode).toHaveTextContent(/Header 1/i);
  });
});
