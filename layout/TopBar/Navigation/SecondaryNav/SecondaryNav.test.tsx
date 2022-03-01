import { render, screen } from "@testing-library/react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { useWorkspaceStore, Actions as WorkspaceActions } from "stores/workspaceStore";
import { SecondaryNavForLocation } from "./SecondaryNav";
import { WorkspaceStoreState } from "types/workspace";
import { MockedUseStoreHook } from "types/tests";
import userEvent from "@testing-library/user-event";

jest.mock("stores/workspaceStore");

describe("SecondaryNavForLocation", () => {
  beforeEach(() => {
    (useWorkspaceStore as MockedUseStoreHook<WorkspaceStoreState, WorkspaceActions>).mockReturnValue([
      {
        selectedWorkSpace: "Envision"
      },
      {}
    ]);
  });

  it("should display relevant nav items for current location", () => {
    const history = createMemoryHistory();
    history.push("/workspaces/Envision");
    render(
      <Router history={history}>
        <SecondaryNavForLocation />
      </Router>
    );
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Map" })).toBeInTheDocument();
  });

  it("should display current location as active", () => {
    const history = createMemoryHistory();
    history.push("/workspaces/Envision");
    render(
      <Router history={history}>
        <SecondaryNavForLocation />
      </Router>
    );

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Explore Map" })).not.toHaveAttribute("aria-current", "page");
  });

  it("should display clicked item as active", () => {
    const history = createMemoryHistory();
    history.push("/workspaces/Envision");
    render(
      <Router history={history}>
        <SecondaryNavForLocation />
      </Router>
    );

    const mapLink = screen.getByRole("link", { name: "Explore Map" });
    expect(mapLink).not.toHaveAttribute("aria-current", "page");

    userEvent.click(mapLink);

    expect(mapLink).toHaveAttribute("aria-current", "page");
  });

  it("should not display nav items not relevant to current location", () => {
    const history = createMemoryHistory();
    history.push("/workspaces/Envision/projects/1234");
    render(
      <Router history={history}>
        <SecondaryNavForLocation />
      </Router>
    );
    expect(screen.queryByRole("link", { name: "Projects" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Explore Map" })).not.toBeInTheDocument();
  });
});
