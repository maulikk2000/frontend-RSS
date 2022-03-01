import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import NotFound404Page from "./NotFound404Page";

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

describe("not found page", () => {
  it("should render `404 - Page Not Found`", () => {
    render(
      <Router>
        <Route>
          <NotFound404Page />
        </Route>
      </Router>
    );
    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
  });
});
