import React, { ReactNode, RefObject } from "react";
import { Html } from "./Html";
import classes from "./HtmlMarkers.module.scss";

type Props = {
  children: ReactNode;
  clickThrough?: boolean;
  itemRef?: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined;
  translateX?: string;
  translateY?: string;
  scaleFactor?: number;
  classType?: "primary" | "secondary" | "label";
};

export const HtmlMarkers = ({
  children,
  clickThrough = true,
  itemRef,
  scaleFactor = 200,
  translateX = "0px",
  translateY = "30px",
  classType = "primary"
}: Props) => {
  return (
    <Html style={clickThrough ? { pointerEvents: "none" } : {}} scaleFactor={scaleFactor} ref={itemRef} center>
      <div
        style={{ transform: `translate(${translateX}, ${translateY})` }}
        className={`${classes.container} ${classes[classType]}`}
      >
        <h2 className={classes.inner}>{children}</h2>
      </div>
    </Html>
  );
};
