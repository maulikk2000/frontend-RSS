import React, { useRef, useState } from "react";
import classes from "./SideBar.module.scss";
import { DraggableCore } from "react-draggable";
import { ReactComponent as ArrowIcon } from "styling/assets/icons/chevronLeft.svg";

export type Props = {
  maxWidth?: number;
  position?: "left" | "right";
};

/**
 * Resizeable side bar component
 */
export const SideBar: React.FC<Props> = ({ children, position = "left", maxWidth = 350 }) => {
  const MIN_WIDTH = 12;
  const [width, setWidth] = useState<number>(maxWidth);
  const isCollapsed = width === MIN_WIDTH;
  const isPointingRight = (position === "left" && isCollapsed) || (position === "right" && !isCollapsed);

  const handleDrag = (e, ui) => {
    const factor = position === "left" ? -1 : 1;
    let newWidth = Math.min(width - ui.deltaX * factor, maxWidth);
    setWidth(Math.max(MIN_WIDTH, newWidth));
  };

  const dragHandlers = {
    onDrag: handleDrag
  };

  const toggleView = () => {
    if (width === MIN_WIDTH) {
      setWidth(maxWidth);
    } else {
      setWidth(MIN_WIDTH);
    }
  };

  const content = [
    <div
      key="content"
      className={`${classes.content} ${isCollapsed ? classes.hideOverflow : ""}`}
      style={{ width: `${width}px` }}
    >
      {children}
    </div>
  ];

  const dragSection = (
    <DraggableCore key="dragSection" {...dragHandlers}>
      <div className={classes.resizeBar}>
        <button className={classes.iconWrapper} onClick={toggleView} data-testid="toggleButton">
          <ArrowIcon className={`${classes.icon} ${isPointingRight ? classes.pointRight : ""}`} />
        </button>
      </div>
    </DraggableCore>
  );

  if (position === "left") {
    content.push(dragSection);
  } else {
    content.unshift(dragSection);
  }

  return (
    <div className={`${classes.wrapper} ${position === "left" ? classes.borderRight : classes.borderLeft}`}>
      {content}
    </div>
  );
};

export default SideBar;
