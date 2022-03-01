import { render, screen } from "@testing-library/react";
import CreateScenario from "./CreateScenario";

describe("the create scenario component", () => {
  it("Should have rendered properly", () => {
    render(<CreateScenario />);
    const header = screen.getByText("Create a New Scenario");
    const input = screen.getByRole("textbox");
    const submitBtn = screen.getByRole("button", { name: /Create Scenario/i });

    expect(header).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
  });
});

jest.mock("three.meshline", () => {});
