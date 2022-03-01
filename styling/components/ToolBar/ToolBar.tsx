import React from "react";
import ToolButton, { Tool } from "./ToolButton";
import classes from "./ToolBar.module.scss";

type ToolForToolbar = {
  group: "primary" | "secondary";
} & Tool;

export type Props = {
  tools: ToolForToolbar[];
};

/**
 * Toolbar for draw tools
 */
export const ToolBar: React.FC<Props> = ({ tools }) => {
  const primaryTools = tools.filter((t) => t.group === "primary");
  const secondaryTools = tools.filter((t) => t.group === "secondary");

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {primaryTools.map((tool) => (
          <ToolButton key={tool.title} {...tool} />
        ))}
      </div>
      <div className={classes.section}>
        {secondaryTools.map((tool) => (
          <ToolButton key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolBar;
