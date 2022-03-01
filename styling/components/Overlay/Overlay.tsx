import React from "react";
import classes from "./Overlay.module.scss";

export const Overlay = ({ children }) => {
  return <div className={classes.overlay}>{children}</div>;
};
