import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioButton } from "./RadioButton";

describe("RadioButton", () => {
  it("should call handler when clicked", () => {
    const handleChange = jest.fn();
    render(
      <RadioButton
        checked={false}
        value={"value"}
        disabled={false}
        label={"RadioButton Label"}
        onChange={handleChange}
      />
    );

    userEvent.click(screen.getByLabelText("RadioButton Label"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should render correctly when not checked", () => {
    render(
      <RadioButton checked={false} value={"value"} disabled={false} label={"RadioButton Label"} onChange={jest.fn()} />
    );

    expect(screen.getByLabelText("RadioButton Label")).toBeInTheDocument();
    expect(screen.getByLabelText("RadioButton Label")).not.toBeChecked();
  });

  it("should render correctly when checked", () => {
    render(
      <RadioButton checked={true} value={"value"} disabled={false} label={"RadioButton Label"} onChange={jest.fn()} />
    );

    expect(screen.getByLabelText("RadioButton Label")).toBeInTheDocument();
    expect(screen.getByLabelText("RadioButton Label")).toBeChecked();
  });

  it("should render correctly when disabled", () => {
    render(
      <RadioButton checked={true} value={"value"} disabled={true} label={"RadioButton Label"} onChange={jest.fn()} />
    );

    expect(screen.getByLabelText("RadioButton Label")).toBeInTheDocument();
    expect(screen.getByLabelText("RadioButton Label")).toBeDisabled();
  });
});
