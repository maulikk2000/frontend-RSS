import { render, screen } from "@testing-library/react";
import Tag from "./Tag";

describe("Tag", () => {
  it("display a tag with tag name", () => {
    render(<Tag type="baseline" tag="Baseline" />);
    expect(screen.getByText("Baseline")).toBeInTheDocument();
  });
});
