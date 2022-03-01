import React, { FC, ReactNode } from "react";
import classes from "./MapControls.module.scss";
import { ViewportProps } from "react-map-gl";
import { ReactComponent as ZoomIn } from "styling/assets/icons/zoomIn.svg";
import { ReactComponent as ZoomOut } from "styling/assets/icons/zoomOut.svg";
import { ReactComponent as North } from "styling/assets/icons/maptools_north.svg";

type MapControl = {
  name: string;
  onClick: () => void;
  icon?: ReactNode;
};

interface Props {
  viewport: Partial<ViewportProps> | undefined;
  onViewPortChange: (viewportProps: Partial<ViewportProps>) => void;
}

export const MapControls: FC<Props> = ({ viewport, onViewPortChange }) => {
  const onZoomIn = () => {
    onViewPortChange({
      ...viewport,
      zoom: viewport && viewport.zoom ? viewport.zoom + 1 : 15,
      transitionDuration: 300
    });
  };

  const onZoomOut = () => {
    onViewPortChange({
      ...viewport,
      zoom: viewport && viewport.zoom ? viewport.zoom - 1 : 14,
      transitionDuration: 300
    });
  };

  const onResetNorth = () => {
    onViewPortChange({
      ...viewport,
      bearing: 0,
      pitch: 0,
      transitionDuration: 200
    });
  };

  const controls: Array<MapControl> = [
    { name: "+", onClick: onZoomIn, icon: <ZoomIn /> },
    { name: "-", onClick: onZoomOut, icon: <ZoomOut /> },
    { name: "N", onClick: onResetNorth, icon: <North /> }
  ];

  return (
    <div className={classes.controlWrapper}>
      {controls.map((control) => {
        return (
          <button key={control.name.replace(" ", "")} onClick={control.onClick}>
            {control.icon}
          </button>
        );
      })}
    </div>
  );
};
