import { render, screen } from "@testing-library/react";
import { ReactComponent as PlanningConstraintsIcon } from "styling/assets/icons/planning_constraints_icon.svg";
import userEvent from "@testing-library/user-event";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("should display button", () => {
    render(<IconButton title="planning constraints" Icon={PlanningConstraintsIcon} onClick={() => {}} />);
    expect(screen.getByRole("button", { name: /planning constraints/i })).toBeInTheDocument();
  });

  it("should call handler when button clicked", () => {
    const handleOpenCompliance = jest.fn();
    render(<IconButton title="planning constraints" Icon={PlanningConstraintsIcon} onClick={handleOpenCompliance} />);
    userEvent.click(screen.getByRole("button", { name: /planning constraints/i }));
    expect(handleOpenCompliance).toHaveBeenCalledTimes(1);
  });
});
