import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("should call handler when changed", () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} checked label="mycheckbox" />);
    userEvent.click(screen.getByLabelText("mycheckbox"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should render correctly when disabled", () => {
    render(<Checkbox onChange={jest.fn()} checked={false} label="mycheckbox" disabled />);
    expect(screen.getByLabelText("mycheckbox")).toBeDisabled();
  });

  it("should render correctly when checked", () => {
    render(<Checkbox onChange={jest.fn()} label="mycheckbox" checked />);
    expect(screen.getByLabelText("mycheckbox")).toBeChecked();
  });
});
