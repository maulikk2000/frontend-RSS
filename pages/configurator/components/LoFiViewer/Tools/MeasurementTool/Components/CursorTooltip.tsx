import React, { ReactNode, RefObject } from "react";
import { Html } from "../../../Common/HtmlMarkers/Html";
import classes from "./CursorTooltip.module.scss";

type Props = {
  children: ReactNode;
  clickThrough?: boolean;
  itemRef?: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined;
  translateX?: string;
  translateY?: string;
  scaleFactor?: number;
  classType?: "primary" | "secondary";
};

export const CursorToolTip = ({
  children,
  clickThrough = true,
  itemRef,
  scaleFactor = 400,
  classType = "primary"
}: Props) => {
  return (
    <Html style={clickThrough ? { pointerEvents: "none" } : {}} scaleFactor={scaleFactor} ref={itemRef} center>
      <div className={`${classes.container} ${classes[classType]}`}>
        <h2 className={classes.inner}>{children}</h2>
      </div>
    </Html>
  );
};
