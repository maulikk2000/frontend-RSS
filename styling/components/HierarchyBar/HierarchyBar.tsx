import React, { ReactNode } from "react";
import { Edit } from "@material-ui/icons";
import { Button } from "../Button/Button";
import classes from "./HierarchyBar.module.scss";

type HierarchyBarProps = {
  title: string;
  measurement: string;
  classType: "primary" | "secondary";
  onEditClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onEditHover?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onEditHoverOut?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

/** Summary Items are predominately used inside Configurator Page and are used for displaying metrics and items that are selected by a user. These are based on the width of their container. */
export const HierarchyBar = ({
  title,
  measurement,
  classType,
  onEditClick,
  onEditHover,
  onEditHoverOut
}: HierarchyBarProps) => {
  return (
    <div className={classes.bar + " " + classes[classType]}>
      <span className={classes.title}>{title}</span>
      <span className={classes.area}>{measurement}</span>
      <span>
        {onEditClick && (
          <Button
            onClick={onEditClick}
            onPointerOver={onEditHover ? onEditHover : undefined}
            onPointerOut={onEditHoverOut ? onEditHoverOut : undefined}
            classType={"icon_transparent"}
          >
            <Edit />
          </Button>
        )}
      </span>
    </div>
  );
};
