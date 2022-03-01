import { PropsWithChildren } from "react";
import classes from "./PanelTip.module.scss";

export type Props = {
  tip: string;
  enabled: boolean;
  alwaysDisplayed?: boolean;
};

export const PanelTip = ({ children, tip, enabled, alwaysDisplayed }: PropsWithChildren<Props>) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className={classes.inherit}>
      <span className={`${classes.info} ${alwaysDisplayed && classes.static}`}>{tip}</span>
      {children}
    </div>
  );
};
