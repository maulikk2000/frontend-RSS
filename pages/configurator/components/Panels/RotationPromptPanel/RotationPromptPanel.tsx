import React, { memo, useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import classes from "./RotationPromptPanel.module.scss";
import { ReactComponent as Ctrl } from "styling/assets/icons/configurator/panelIcons/CTRL.svg";
import { ReactComponent as LeftMouse } from "styling/assets/icons/configurator/panelIcons/LeftMouse.svg";

export const RotationPromptPanel = memo(() => {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const handleClick = () => {
    setIsHidden(true);
  };

  useEffect(() => {
    let timer = setTimeout(() => setIsHidden(true), 10000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Draggable bounds={"parent"}>
      <div style={{ display: isHidden ? "none" : "block" }} className={classes.rotationPrompt}>
        <button className={classes.button} onClick={(e) => handleClick()}>
          x
        </button>
        <div className={classes.iconBar}>
          <Ctrl />
          <span className={classes.icon}>+</span>
          <LeftMouse />
        </div>
        <div>
          <div className={classes.text}>Control + Left Click To Rotate</div>
        </div>
      </div>
    </Draggable>
  );
});
