import React from "react";
import classes from "./ConfigToolWrapper.module.scss";

export type ConfigToolWrapperProps = {
  children: any;
};

export const ConfigToolWrapper = ({ children }: ConfigToolWrapperProps) => {
  return <div className={classes.tool_wrapper}>{children}</div>;
};
