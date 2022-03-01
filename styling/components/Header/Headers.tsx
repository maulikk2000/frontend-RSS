import React from "react";
import classes from "./Headers.module.scss";

export type HeaderProps = {
  type: "H1" | "H2" | "H3" | "H4" | "H5";
  title: string;
};

// Below is a comment that will be displayed in the Docs in Storybook
/**
Hierarchy is communicated through differences in font weight 
**/

export const Header = ({ title, type }: HeaderProps) => {
  return <div className={classes.base + " " + classes[type]}>{title}</div>;
};
