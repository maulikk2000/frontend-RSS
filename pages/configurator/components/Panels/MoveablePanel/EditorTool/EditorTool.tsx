import React from "react";

import classes from "./EditorTool.module.scss";

type ToolProps = {
  title: string;
  icon?: any;
  selected: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};
export const EditorTool = ({ title, icon, selected, onClick }: ToolProps) => {
  return (
    <div className={`${classes.toolItem} ${selected ? classes.selected : ""}`} onClick={onClick}>
      {icon && <div className={classes.toolIcon}>{icon}</div>}
      <div className={classes.toolTitle}>{title}</div>
    </div>
  );
};
