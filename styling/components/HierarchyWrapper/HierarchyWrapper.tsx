import React, { PropsWithChildren } from "react";
import { Button } from "../Button/Button";
import classes from "./HierarchyWrapper.module.scss";

type HierarchyWrapperProps = {
  title: string;
  measurement: string;
  classType: "primary" | "secondary";
  hierarchyType: "feature" | "form";
  onEditClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onWrapperClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onHover?: ((event: React.PointerEvent<HTMLButtonElement>) => void) | undefined;
  onHoverOut?: ((event: React.PointerEvent<HTMLButtonElement>) => void) | undefined;
  selected?: boolean;
};

/** Hierarchy Items are predominately used inside Configurator Page and are used for displaying metrics and items that are selected by a user. These are based on the width of their container. */
export const HierarchyWrapper = ({
  title,
  measurement,
  hierarchyType,
  onEditClick,
  onWrapperClick,
  onHover,
  onHoverOut,
  selected,
  children
}: PropsWithChildren<HierarchyWrapperProps>) => {
  return (
    <div
      className={selected ? `${classes.card_wrapper} ${classes.selected}` : classes.card_wrapper}
      onClick={onWrapperClick}
    >
      <div className={`${classes.card_inner} ${classes[hierarchyType]}`}>
        <div className={classes.header}>
          <h2>{title}</h2>
          <span>{measurement}</span>
          {onEditClick && (
            <Button classType={"textIcon"} onClick={onEditClick} onPointerOver={onHover} onPointerOut={onHoverOut}>
              Edit
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
