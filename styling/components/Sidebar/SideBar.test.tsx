import React from "react";
import { screen, render } from "@testing-library/react";
import SideBar from "./SideBar";

describe("<SideBar />", () => {
  it("should render the component", () => {
    render(<SideBar />);
    expect(screen.getByTestId("toggleButton")).toBeInTheDocument();
  })
})
