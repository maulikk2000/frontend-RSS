import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Unauthorized401Page from "./Unauthorized401Page";

jest.mock("three/examples/jsm/loaders/GLTFLoader.js", () => ({
  load: () => ({})
}));

jest.mock("mapbox-gl/dist/mapbox-gl.css", () => ({}));

jest.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  orbitControls: () => ({})
}));

jest.mock("three/examples/jsm/controls/TransformControls.js", () => ({
  transformControls: () => ({})
}));

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn()
  })),
  NavigationControl: jest.fn()
}));

describe("show Unauthorised page", () => {
  it("should render `401 - Unauthorized`", () => {
    render(
      <Router>
        <Route>
          <Unauthorized401Page />
        </Route>
      </Router>
    );
    expect(screen.getByText("401 - Unauthorized: Access is denied")).toBeInTheDocument();
  });
});
