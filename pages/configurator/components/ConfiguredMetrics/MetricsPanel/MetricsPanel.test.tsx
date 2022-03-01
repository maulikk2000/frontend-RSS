import { render, screen } from "@testing-library/react";
import React from "react";
import { MetricsPanel } from "./MetricsPanel";

describe("the metrics panel component", () => {
  it("Should have rendered with correct title", () => {
    render(<MetricsPanel title="panel title" />);
    const header = screen.getByText("panel title");
    expect(header).toBeInTheDocument();
  });
});
