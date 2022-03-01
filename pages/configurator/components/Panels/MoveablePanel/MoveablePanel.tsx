import React, { PropsWithChildren, useEffect, useRef } from "react";

import classes from "./MoveablePanel.module.scss";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";

import { ReactComponent as MovePanelIcon } from "styling/assets/icons/configurator/panelIcons/MovePanel.svg";
import { ReactComponent as OpenMapIcon } from "styling/assets/icons/configurator/panelIcons/OpenMap.svg";
import { ReactComponent as HideMapIcon } from "styling/assets/icons/configurator/panelIcons/HideMap.svg";

type Props = {
  isDocked: boolean;
  setIsDocked: React.Dispatch<React.SetStateAction<boolean>>;
  isEnabled?: boolean;
};
export const MoveablePanel = ({ isDocked, setIsDocked, isEnabled = true, children }: PropsWithChildren<Props>) => {
  const [mapSettings, mapSettingsActions] = useMapSettingsStore();

  const panelRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable>(null);
  let draggable = draggableRef.current;
  let panel = panelRef.current;

  let panelClass = `${classes.moveablePanel}`;
  if (isDocked) panelClass += ` ${classes.docked}`;
  if (!isEnabled) panelClass += ` ${classes.disabled}`;

  useEffect(() => {
    if (panel) {
      panel.style.display = `flex`;
      panel.style.left = `calc(50% - ${panel!.offsetWidth / 2}px`;
    }
  }, [panel && panel.style]);

  const onDragging = (e: DraggableEvent, data: DraggableData) => {
    if (!draggable || !panel) {
      return;
    }

    const isDockable = data.y > 40 || (panel.style.left === "0px" && data.y > -20);

    if (!isDockable) {
      panel.style.border = "solid transparent 2px";

      if (isDocked) {
        panel.style.transform = "unset";
        draggable.setState({
          x: 0,
          y: 0
        });

        setIsDocked(false);
      }
    } else if (isDockable && !isDocked) {
      panel.style.border = "solid 2px #23b4c3";
    }
  };

  const onStop = (e: DraggableEvent, data: DraggableData) => {
    if (!draggable || !panel) {
      return;
    }

    const isDockable = data.y > 40 || (panel.style.left === "0px" && data.y > -20);

    if (isDockable) {
      panel.style.border = "0";
      panel.style.transform = "unset";
      panel.style.left = "0";
      panel.style.bottom = "0";
      draggable.setState({
        x: 0,
        y: 0
      });

      setIsDocked(true);
    }
  };

  const handleMapDisplay = () => {
    mapSettingsActions.setDisplayMap(!mapSettings.displayMap);
  };

  return (
    <Draggable handle="strong" ref={draggableRef} onStop={onStop} onDrag={onDragging} bounds="parent">
      <div ref={panelRef} className={panelClass}>
        <div className={classes.leftIconColumn}>
          <strong className={classes.draggableIcon}>
            <div className={classes.icon}>
              <MovePanelIcon />
            </div>
          </strong>

          <div onClick={handleMapDisplay} className={classes.icon}>
            Map
            {mapSettings.displayMap ? <HideMapIcon /> : <OpenMapIcon className={classes.hideMapIcon} />}
          </div>
        </div>
        <div className={classes.panelItems}>{children}</div>
      </div>
    </Draggable>
  );
};
