import { MouseEventHandler, useCallback } from "react";
import { useAnalytics } from "utils/analytics";
import classes from "./ToolButton.module.scss";

export type Tool = {
  title: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  analyticsId?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export type Props = Tool & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button for toolbar
 */
export const ToolButton: React.FC<Props> = ({ title, Icon, isActive, analyticsId, onClick, disabled }) => {
  const { trackEvent } = useAnalytics();
  const handleClick = useCallback(
    (event) => {
      if (disabled) {
        return null;
      }
      if (analyticsId) {
        trackEvent("button_click", { button_id: analyticsId });
      }
      if (onClick) {
        onClick(event);
      }
    },
    [analyticsId, onClick, trackEvent]
  );

  return (
    <div className={classes.wrapper}>
      <button
        onClick={handleClick}
        className={`${isActive ? classes.active : undefined} ${disabled ? classes.disabled : undefined}`}
        aria-label={title}
      >
        <Icon />
      </button>
    </div>
  );
};

export default ToolButton;
