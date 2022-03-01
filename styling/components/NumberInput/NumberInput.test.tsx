import { render, screen } from "@testing-library/react";
import { NumberInput } from "./NumberInput";

describe("NumberInput", () => {
  let exampleNumber = "50";
  const setExampleNumber = (number) => {
    exampleNumber = number;
  };

  it("Number Input Should render 2 Buttons", () => {
    render(
      <NumberInput
        name="Example"
        min={0}
        max={200}
        defaultValue={exampleNumber}
        disabled={false}
        onChange={setExampleNumber}
        metric={"ft"}
        width={"small"}
      />
    );

    expect(screen.getByRole("button", { name: "Decrement Example" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Increment Example" })).toBeInTheDocument();
  });

  it("Number Input Should render an input", () => {
    render(
      <NumberInput
        name="Example2"
        min={0}
        max={200}
        defaultValue={exampleNumber}
        disabled={false}
        onChange={setExampleNumber}
        metric={"ft"}
        width={"small"}
      />
    );
    expect(screen.getByLabelText("Example2")).toBeInTheDocument();
    expect(screen.getByLabelText("Example2")).toHaveValue(50);
  });
});
