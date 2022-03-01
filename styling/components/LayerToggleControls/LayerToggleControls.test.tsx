import { render, screen } from "@testing-library/react";
import { LayerToggleControls } from "./LayerToggleControls";

jest.mock("styling/variables.module.scss", () => ({
  EliPodiumDarkTeal: "#000000"
}));

describe("Layer Toggle component for Explore Map", () => {
  const handleLayerToggle = jest.fn();

  const args = {
    subtitle: "View rich contextual data by toggling data layers and visualise on the map in 2D or 3D.",
    title: "Layers",
    items: [
      {
        id: "projects",
        name: "Show Projects In Map",
        isOn: true,
        order: 1,
        group: "secondary"
      },
      {
        id: "masterplan",
        name: "Masterplan",
        isOn: false,
        order: 0,
        group: "primary"
      },
      {
        id: "threedbuildings",
        name: "3D Building Layer",
        isOn: true,
        order: 2,
        group: "primary"
      }
    ],
    handleLayerToggle
  };

  it("should display the title", () => {
    render(<LayerToggleControls {...args} />);
    expect(screen.getByRole("heading")).toHaveTextContent(args.title);
    expect(screen.getByText(args.subtitle)).toBeInTheDocument();
  });

  it("should display the subtitle", () => {
    render(<LayerToggleControls {...args} />);
    expect(screen.getByText(args.subtitle)).toBeInTheDocument();
  });
  
});
