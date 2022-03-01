import { ComplianceModal } from "./ComplianceModal";
import { render, screen, fireEvent } from "@testing-library/react";

let modalContainer: HTMLElement;
let closeComplianceFn: jest.Mock;

beforeEach(() => {
  closeComplianceFn = jest.fn();
  let { container } = render(<ComplianceModal closeCompliance={closeComplianceFn} />);
  modalContainer = container;
});

describe("the scenario list component", () => {
  it("should have a div of class container", () => {
    const mainContainer = modalContainer.querySelector(".container");
    expect(mainContainer).toBeInTheDocument();
  });

  it("should have a div of class header", () => {
    const header = modalContainer.querySelector(".header");
    expect(header).toBeInTheDocument();
  });

  it("should render a close button", () => {
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    const closeIcon = modalContainer.querySelectorAll("svg");
    fireEvent.click(closeIcon[0]);
    expect(closeComplianceFn).toHaveBeenCalledTimes(1);
  });

  it("should render an h3", () => {
    const h3 = screen.getByText("Planning Constraints");
    expect(h3).toBeInTheDocument();
  });

  it("should contain 2 input toggles for 3 different layers and links", () => {
    const inputs = modalContainer.querySelectorAll("input");
    expect(inputs).toHaveLength(2);
  });

  it("should contain 4 links to the DA pdf", () => {
    const links = modalContainer.querySelectorAll("a");
    expect(links).toHaveLength(4);
  });

  it("should contain 4 layers with an icon, title and height", () => {
    const iconLayers = modalContainer.querySelectorAll(".layerIcon");
    const valueLayers = modalContainer.querySelectorAll(".layerValue");
    expect(iconLayers).toHaveLength(4);
    expect(valueLayers).toHaveLength(4);
  });
});

jest.mock("three.meshline", () => {});
