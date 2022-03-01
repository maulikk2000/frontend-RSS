import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAnalytics } from "utils/analytics";
import { Button } from "./Button";

jest.mock("utils/analytics");

const mockTrackEvent = jest.fn();

describe("Button", () => {
  beforeEach(() => {
    mockTrackEvent.mockClear();
    (useAnalytics as jest.Mock).mockReturnValue({
      trackEvent: mockTrackEvent
    });
  });

  it("should call handler when clicked", () => {
    const handleClick = jest.fn();
    render(
      <Button classType="primary" onClick={handleClick}>
        This is a button
      </Button>
    );

    userEvent.click(screen.getByRole("button", { name: /this is a button/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("should track analytics when clicked and analytics id exists", () => {
    const handleClick = jest.fn();
    render(
      <Button classType="primary" onClick={handleClick} analyticsId="MyButtonTest">
        This is a button
      </Button>
    );

    userEvent.click(screen.getByRole("button", { name: /this is a button/i }));
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith("button_click", { button_id: "MyButtonTest" });
  });

  it("should be displayed correctly", () => {
    const handleClick = jest.fn();
    render(
      <Button classType="primary" onClick={handleClick}>
        This is a button
      </Button>
    );

    expect(screen.getByRole("button", { name: /this is a button/i })).toBeInTheDocument();
  });

  it("should show default loading state correctly", () => {
    const handleClick = jest.fn();
    render(
      <Button classType="primary" onClick={handleClick} isLoading={true}>
        This is a button
      </Button>
    );

    const targetButton = screen.getByRole("button", {
      name: /This is a button.../i
    });

    expect(targetButton).toBeInTheDocument();
    expect(targetButton).toBeDisabled();
  });

  it("should show custom loading state correctly", () => {
    const handleClick = jest.fn();
    render(
      <Button classType="primary" onClick={handleClick} isLoading={true} loadingText="Reticulating splines">
        This is a button
      </Button>
    );

    const targetButton = screen.getByRole("button", {
      name: /reticulating splines.../i
    });

    expect(targetButton).toBeInTheDocument();
    expect(targetButton).toBeDisabled();
  });
});
