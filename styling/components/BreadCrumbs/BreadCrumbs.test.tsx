import { render, screen } from "@testing-library/react";
import BreadCrumbs from "./BreadCrumbs";
import { MemoryRouter } from "react-router";

describe("<BreadCrumbs />", () => {
  const crumbs = [
    {
      id: "2a769c74-ddc2-4cde-8a5c-38b2fb393adf",
      label: "Workspace",
      path: "/workspaces/East Whisman",
      value: "East Whisman"
    },
    {
      id: "9268a19b-8c22-44ce-9143-7f39e6faf00d",
      label: "Project",
      path: "/workspaces/East Whisman/projects/9268a19b-8c22-44ce-9143-7f39e6faf00d",
      value: "EW 1"
    },
    {
      id: "0f487b37-6f95-4cf3-bb3e-055a78a6700b",
      label: "Scenario",
      value: "Base Scenario"
    }
  ];
  const component = (
    <MemoryRouter initialEntries={["/workspaces/Envision"]}>
      <BreadCrumbs crumbs={crumbs} />
    </MemoryRouter>
  );

  beforeEach(() => {
    render(component);
  });

  it("Should display the labels: Workspace, Project, Scenario", () => {
    crumbs.forEach(({ label }) => expect(screen.getByText(label)).toHaveTextContent(label));
  });

  it("Should display the values", () => {
    crumbs.forEach(({ value }) => expect(screen.getByText(value)).toHaveTextContent(value));
  });

  it("Should not have link if item does not have path", () => {
    expect(screen.getByText(crumbs[2].value)).not.toHaveAttribute("href");
  });

  it("Should have link if item have a path value", () => {
    expect(screen.getByText(crumbs[0].value)).toHaveAttribute("href");
    expect(screen.getByText(crumbs[1].value)).toHaveAttribute("href");
  });
});
