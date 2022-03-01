import { PropsWithChildren } from "react";
import Draggable from "react-draggable";
import { ReactComponent as DraggableIcon } from "styling/assets/icons/draggable_icon.svg";
import classes from "./MetricsPanel.module.scss";

type MetricsPanel = {
  title: string;
};
export const MetricsPanel = ({ title, children }: PropsWithChildren<MetricsPanel>) => {
  return (
    <Draggable bounds="parent" handle="h2">
      <div className={classes.metricWrapper}>
        <DraggableIcon className={classes.draggableIcon} />
        <div className={classes.metricContent}>
          <h2>{title}</h2>
          <div className={classes.wrapper}>{children}</div>
        </div>
      </div>
    </Draggable>
  );
};
