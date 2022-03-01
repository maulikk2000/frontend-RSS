import React, { MouseEvent } from "react";
import classes from "./ImageSelector.module.scss";
import { Check } from "@material-ui/icons";

type ImageSelectorProps = {
  disabled: boolean;
  selected: boolean;
  image: string | any | null;
  title: string;
  height: "short" | "tall";
  text?: string;
  hovered?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onHover?: (event: MouseEvent<HTMLDivElement>) => void;
  onHoverOut?: (event: MouseEvent<HTMLDivElement>) => void;
};

/** 
- These need to be wrapped in the FlexBox component. 
- Custom Radio buttons are to be used when only one item can be selected from a list.
- They are to be used in panel areas either 2, 3 or 4 across depending on how many stacked custom radio box selections there are. 
- These are based on the width of their container and sit inline with the text.
*/

export const ImageSelector = ({
  disabled,
  selected,
  image,
  title,
  height,
  text,
  hovered,
  onClick,
  onHover,
  onHoverOut
}: ImageSelectorProps) => {
  const disabledFunction = () => {
    return false;
  };

  return (
    <div
      className={(hovered ? classes.hovered + " " : "") + (classes.component + " " + classes[`modal_${height}`])}
      data-cy={title}
    >
      <div
        onPointerOver={onHover ? onHover : () => {}}
        onPointerOut={onHoverOut ? onHoverOut : () => {}}
        onClick={disabled ? disabledFunction : onClick}
        className={disabled ? classes.image_selector_disabled : classes.image_selector}
        id={title.replace(/\s/g, "") + "-selector"}
      >
        {selected && (
          <div className={classes.checked}>
            <Check />
          </div>
        )}
        {image ? (
          <div
            className={(selected ? classes.blank_image_selected + " " : "") + (classes.image + " " + classes.height)}
          >
            {image}
          </div>
        ) : text ? (
          <div
            className={
              (selected ? classes.blank_image_selected + " " : classes.blank_image + " ") +
              (classes.text_image + " " + classes.height)
            }
          >
            <span>{text}</span>
          </div>
        ) : (
          <div
            className={(selected ? classes.blank_image_selected + " " : classes.blank_image + " ") + classes.height}
          />
        )}
        {title}
      </div>
    </div>
  );
};
