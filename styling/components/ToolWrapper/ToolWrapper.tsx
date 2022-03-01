import React from "react";

import classes from "./ToolWrapper.module.scss";

export const ToolWrapper = (props) => {
  return <div className={classes.tool_wrapper}>{props.children}</div>;
};
