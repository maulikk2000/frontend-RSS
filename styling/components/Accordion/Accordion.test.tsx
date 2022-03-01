import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Accordion from "./Accordion";

describe("Check the accordion in its closed state", () => {
  it("should have a header displayed", () => {
    render(<Accordion header="Accordion header">all the content</Accordion>);
    expect(screen.getByText("Accordion header")).toBeInTheDocument();
  });

  it("should display the right header if display is block and one is provided", () => {
    render(<Accordion header="Accordion" headerRight="the right" />);
    expect(screen.getByText("the right")).toBeInTheDocument();
  });

  it("should NOT display the right header if display is flat and one is provided", () => {
    render(<Accordion header="Accordion" display="flat" headerRight="the right" />);
    expect(screen.queryByText("the right")).not.toBeInTheDocument();
  });

  it("should NOT display the content", () => {
    render(<Accordion header="Accordion header">all the content</Accordion>);
    expect(screen.queryByText("all the content")).not.toBeInTheDocument();
  });

  it("should show the Expand button", () => {
    render(<Accordion header="Accordion header">all the content</Accordion>);
    expect(screen.getByRole("button", { name: /expand/i })).toBeInTheDocument();
  });
});

describe("Check the accordion in its open state", () => {
  it("should have a header displayed", () => {
    render(<Accordion header="Accordion header">all the content</Accordion>);
    userEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByText("Accordion header")).toBeInTheDocument();
  });

  it("should NOT display the right header if one is provided and the display is block and accordion is open", () => {
    render(<Accordion header="Accordion" headerRight="the right" />);
    userEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.queryByText("the right")).not.toBeInTheDocument();
  });

  it("should display the right header if one is provided and the display is flat and accordion is open", () => {
    render(<Accordion header="Accordion" display="flat" headerRight="the right" />);
    userEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByText("the right")).toBeInTheDocument();
  });

  it("should display the content", () => {
    render(<Accordion header="Accordion header">all the content</Accordion>);
    userEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByText("all the content")).toBeInTheDocument();
  });

  it("should show the Collapse button", () => {
    render(<Accordion header="Accordion header">all the content</Accordion>);
    userEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByRole("button", { name: /collapse/i })).toBeInTheDocument();
  });

  it("should hide content after clicking Collapse button", () => {
    render(<Accordion header="Accordion header">all the content</Accordion>);
    userEvent.click(screen.getByRole("button", { name: /expand/i }));
    expect(screen.getByText("all the content")).toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: /collapse/i }));
    expect(screen.queryByText("all the content")).not.toBeInTheDocument();
  });
});
