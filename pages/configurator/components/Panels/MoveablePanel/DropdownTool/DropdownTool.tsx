import React, { useRef } from "react";

import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import classes from "./DropdownTool.module.scss";

type ToolProps = {
  title: string;
  icon?: any;
  selected: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  /** Takes in an array of EditorTool */
  selection: JSX.Element[];
  docked?: boolean;
};
export const DropdownTool = ({ title, icon, selected, onClick, selection, docked }: ToolProps) => {
  const toolRef = useRef<HTMLDivElement>(null);
  const dropdownSelectionRef = useRef<HTMLDivElement>(null);

  if (dropdownSelectionRef.current && toolRef.current) {
    dropdownSelectionRef.current.style.width = `${toolRef.current.offsetWidth}px`;
  }

  return (
    <div className={`${classes.dropdownItem} ${selected ? classes.selected : ""}`}>
      <div className={`${classes.dropdownSelections} ${docked ? classes.docked : ""}`} ref={dropdownSelectionRef}>
        {selected && selection.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)}
      </div>
      <div
        ref={toolRef}
        className={`${classes.toolItem} ${selected ? classes.selected : ""} ${docked ? classes.docked : ""}`}
        onClick={onClick}
      >
        {icon && <div className={classes.toolIcon}>{icon}</div>}
        <div className={classes.toolTitle}>{title}</div>
        <div className={`${classes.dropdownExpand}`}>
          {selected ? <ExpandLessIcon preserveAspectRatio="none" /> : <ExpandMoreIcon preserveAspectRatio="none" />}
        </div>
      </div>
    </div>
  );
};
