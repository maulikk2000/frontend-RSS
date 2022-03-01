import React from "react";
import classes from "./ButtonCheckbox.module.scss";

export type ButtonCheckboxObject = {
  title: string;
  onClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
  onHover?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
  onHoverOut?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
  selected: boolean;
  disabled?: boolean;
};

export type ButtonCheckboxProps = {
  classType: "primary" | "row" | "secondary";
  objects: ButtonCheckboxObject[];
};

// Below is a comment that will be displayed in the Docs in Storybook
/**
- Multiple Selections are available
- Each item has one onClick function that may differ between items
- Can be disabled
**/

export const ButtonCheckbox = ({ classType, objects }: ButtonCheckboxProps) => {
  return (
    <div className={`${classes.wrapper} ${classes[classType]}`}>
      {objects.map((object, index) => (
        <button
          key={index}
          className={object.selected ? `${classes[classType]} ${classes.selected}` : classes[classType]}
          onPointerOver={object.onHover}
          onPointerOut={object.onHoverOut}
          onClick={object.onClick}
          disabled={object.disabled}
          data-cy={"Checkbox Button " + object.title}
        >
          {object.title}
        </button>
      ))}
    </div>
  );
};
