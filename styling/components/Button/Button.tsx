import React, { PropsWithChildren, useCallback } from "react";
import { useAnalytics } from "utils/analytics";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import classes from "./Button.module.scss";

export type ButtonProps = {
  isLoading?: boolean;
  loadingText?: string;
  analyticsId?: string;
  classType: "primary" | "secondary" | "text" | "textIcon" | "icon" | "icon_transparent";
};

// Below is a comment that will be displayed in the Docs in Storybook
/**
- Strictly one primary call to action page used per page at any given time.
- Transitions to the highlight colour on hover and select.
- Primary: Strictly one primary call to action page used per page at any given time. Transitions to the highlight colour on hover and select.
- Secondary: To be used as a second call to action when a primary button is presented.
- Tertiary: To be used for when there are multiple buttons on screen or when it’s of lesser importance to primary and secondary sign posting.
- Text: To be used on a page when there are multiple CTA’s with no set hierarchy or for supporting buttons for lesser user interaction. 
**/

export const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  onClick,
  isLoading,
  loadingText,
  analyticsId,
  className,
  classType,
  ...otherProps
}: PropsWithChildren<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>) => {
  const { trackEvent } = useAnalytics();
  const handleClick = useCallback(
    (event) => {
      if (analyticsId) {
        trackEvent("button_click", { button_id: analyticsId });
      }
      if (onClick) {
        onClick(event);
      }
    },
    [analyticsId, onClick, trackEvent]
  );
  return isLoading ? (
    <button className={`${classes[classType]} ${className ? className : undefined}`} disabled>
      <span>{loadingText ? loadingText : children}...</span>&nbsp;
      <LoadingSpinner size="small" />
    </button>
  ) : (
    <button
      className={`${classes[classType]} ${className ? className : undefined}`}
      onClick={handleClick}
      {...otherProps}
    >
      {children}
    </button>
  );
};
