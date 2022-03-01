import React, { FC } from "react";
import classes from "./LeftSidebarContent.module.scss";

type Props = {
  backLinkComponent: React.ReactNode;
  actionsComponent?: React.ReactNode;
};

export const LeftSidebarContent: FC<Props> = ({ children, backLinkComponent, actionsComponent }) => {
  return (
    <div className={classes.metricWrapper}>
      <div className={classes.backButton}>{backLinkComponent}</div>
      {children}
      {actionsComponent && <div className={classes.buttonPanel}>{actionsComponent}</div>}
    </div>
  );
};
