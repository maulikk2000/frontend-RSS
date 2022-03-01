import { RightModal } from "./RightModal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("RightModal", () => {
  it("renders title", () => {
    render(<RightModal title="Mock Modal" onClose={() => {}} />);
    expect(screen.getByText("Mock Modal")).toBeInTheDocument();
  });

  it("renders content given by prop: children", () => {
    render(
      <RightModal title="Mock Modal" onClose={() => {}}>
        <p>Mock Content</p>
      </RightModal>
    );
    expect(screen.getByText("Mock Content")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    const { container } = render(<RightModal title="Mock Modal" onClose={onClose} />);
    const closeIcon = container.querySelectorAll("svg");
    userEvent.click(closeIcon[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
