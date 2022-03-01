import React from "react";

import { render, screen } from "@testing-library/react";

import { Tooltip } from "./Tooltip";

describe("Tooltip component Navy", () => {
  it("should display when react node message was passed in", () => {
    render(<Tooltip message={<h1>Tip</h1>} />);
    expect(screen.getByText("Tip")).toBeInTheDocument();
  });

  it("should show children when passed in as text", () => {
    render(<Tooltip message="hello">Child</Tooltip>);
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("should show children when passed in as nodes", () => {
    render(
      <Tooltip message="hello">
        <span>Child</span>
      </Tooltip>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
