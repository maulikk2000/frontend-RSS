import React, { ReactNode, FC } from "react";
import classes from "./Tooltip.module.scss";

interface Props {
  message?: string | ReactNode;
  position?: "top" | "left" | "right" | "bottom";
}

export const Tooltip: FC<Props> = ({ message, position = "top", children }) => {
  if (message == null || message === "") {
    return <>{children}</>;
  }

  return (
    <div className={classes.tooltip}>
      <div className={`${classes.message} ${classes[position]}`}>{message}</div>
      {children}
    </div>
  );
};
