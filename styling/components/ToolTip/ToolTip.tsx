import React from "react";
import { Tooltip } from "@material-ui/core";
import classes from "./ToolTip.module.scss";

export type Props = {
  children: any;
  type: "question" | "info";
};

/** These are based on the width of their container and sit inline with the text.*/
export const ToolTip = ({ children, type = "info" }: Props) => {
  return (
    <Tooltip title={children}>
      <span className={classes.tooltip}>{type === "info" ? "i" : "?"}</span>
    </Tooltip>
  );
};

ToolTip.defaultProps = {
  type: "info"
};
