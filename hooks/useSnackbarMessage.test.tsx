import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth0 } from "../stores/auth0";
import { SnackbarProvider } from "notistack";
import PageWrapper from "layout/PageWrapper/PageWrapper";
import { useScenarioStore } from "stores/scenarioStore";
import { ApiCallState } from "types/common";

jest.mock("three/examples/jsm/loaders/GLTFLoader.js", () => ({
  load: () => ({})
}));

jest.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  orbitControls: () => ({})
}));

jest.mock("three/examples/jsm/controls/TransformControls.js", () => ({
  transformControls: () => ({})
}));

jest.mock("three.meshline", () => {});

jest.mock("stores/scenarioStore", () => {
  return {
    useScenarioStore: jest.fn()
  };
});

// intercept the useAuth0 function and mock it
jest.mock("../stores/auth0");

describe("useSnackbarMessage custom hook", () => {
  beforeEach(() => {
    // Mock the Auth0 hook and make it return a logged in state
    (useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true
    });
  });

  it("should display a message and action for error", () => {
    (useScenarioStore as jest.Mock).mockReturnValue([
      {
        scenarios: [],
        selectedScenarioIds: [],
        scenariosComparison: [],
        compareScenariosState: ApiCallState.Idle,
        message: { text: "error message", variant: "error" }
      },
      {
        setMessageState: jest.fn()
      }
    ]);

    render(
      <MemoryRouter>
        <SnackbarProvider>
          <PageWrapper></PageWrapper>
        </SnackbarProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("error message", { exact: false })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
  });
});
