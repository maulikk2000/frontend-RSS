import React, { FC, HTMLAttributes } from "react";
import classes from "./Panel.module.scss";

export type PanelWidthSetting = "half" | "full" | "third" | "forty" | "fifth" | "auto" | "none";
export type OverlaySetting = "left" | "right";

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  width: PanelWidthSetting;
  overlay?: OverlaySetting;
  padding?: "all" | "topBottom" | "sides";
}

export const Panel: FC<PanelProps> = ({ children, width, padding, overlay, ...otherProps }) => {
  const classList = [classes.panel, classes[width]];

  padding && classList.push(classes[padding]);
  overlay && classList.push(classes.overlay, classes[overlay]);

  return (
    <div className={classList.join(" ")} {...otherProps}>
      {children}
    </div>
  );
};
