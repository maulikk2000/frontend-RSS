import React from "react";
import classes from "./Fader.module.scss";

type FaderProps = {
  classType: "top" | "bottom";
  top?: string;
};

// Below is a comment that will be displayed in the Docs in Storybook
/** These are based on the width of their container and sit inline with the text. */

export const Fader = ({ classType, top }: FaderProps) => {
  return <div className={classes[classType]} style={top ? { top: top } : {}} />;
};
