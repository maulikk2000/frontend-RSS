import { screen, render } from "@testing-library/react";
import ToolButton from "./ToolButton";
import userEvent from "@testing-library/user-event";
import { useAnalytics } from "utils/analytics";
import { ReactComponent as PolygonIcon } from "styling/assets/icons/sitetools-polygon.svg";

jest.mock("utils/analytics");

const mockTrackEvent = jest.fn();

describe("<ToolButton />", () => {
  beforeEach(() => {
    mockTrackEvent.mockClear();
    (useAnalytics as jest.Mock).mockReturnValue({
      trackEvent: mockTrackEvent
    });
  });

  it("should call handler when clicked", () => {
    const handleClick = jest.fn();
    render(<ToolButton Icon={PolygonIcon} onClick={handleClick} title="this is a ToolButton" />);

    userEvent.click(screen.getByRole("button", { name: /this is a ToolButton/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("should track analytics when clicked and analytics id exists", () => {
    const handleClick = jest.fn();
    render(
      <ToolButton
        Icon={PolygonIcon}
        onClick={handleClick}
        title="this is a ToolButton"
        analyticsId="MyToolButtonTest"
      />
    );

    userEvent.click(screen.getByRole("button", { name: /this is a ToolButton/i }));
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith("button_click", {
      button_id: "MyToolButtonTest"
    });
  });
});
