import React, { PropsWithChildren } from "react";
import classes from "./ToggleStructure.module.scss";

/* ToggleStructure Component */
type ToggleStructureProps = {
  title: string;
};

/**
- Selection controls allow users to complete tasks that involve making choices such as selecting options, or switching settings on or off. 
- Selection controls are found on screens that ask users to make decisions or declare preferences such as settings or dialogs and immediately activate or deactivate something.
- Based on the width of the wrapping container.
 */
export const ToggleStructure = ({ title, children }: PropsWithChildren<ToggleStructureProps>) => {
  return (
    <div className={classes.settings_wrapper}>
      <div className={classes.settings_title}>{title}</div>
      <div className={classes.settings_content}>{children}</div>
    </div>
  );
};
