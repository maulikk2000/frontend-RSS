import React from "react";
import classes from "./ToolsColumn.module.scss";

export const ToolsColumn: React.FC = ({ children }) => {
  return (
    <div className={classes.toolsColumn}>
      <div className={classes.toolsContent}>{children}</div>
    </div>
  );
};
