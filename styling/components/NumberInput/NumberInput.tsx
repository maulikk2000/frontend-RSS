import React, { RefObject } from "react";
import classes from "./NumberInput.module.scss";
import { ExpandMore, ExpandLess } from "@material-ui/icons";

interface NumberInputProps {
  name: string;
  min?: number;
  max?: number;
  defaultValue: string;
  onChange: any;
  disabled?: boolean;
  metric: string;
  width: "standard" | "small" | "medium" | "large";
  inputRef?: RefObject<any>;
}

/**
- Numeric fields will have units based on the field required. 
- Units of measurements should be shown inline with the text with a default start value of 0.
- Users should receive feedback when changing states, this is highlighted by the primary coloured arrow.
 */

export const NumberInput = ({
  name,
  min,
  max,
  defaultValue,
  onChange,
  disabled,
  metric,
  width,
  inputRef
}: NumberInputProps) => {
  const handleLeaveInput = (event: React.FocusEvent<HTMLInputElement>) => {
    const value: number = parseFloat(event.target.value);
    if (inputRef) {
      if (event.target.value === "" || (!event.target.value && value !== 0)) {
        inputRef.current.value = defaultValue;
      } else {
        if ((max && value > max) || (min && value < min)) {
          if (value > max!) {
            inputRef.current.value = max;
            onChange(max);
          } else if (value < min!) {
            inputRef.current.value = min;
            onChange(min);
          }
        } else {
          inputRef.current.value = event.target.value;
          onChange(value);
        }
      }
    }
  };

  const handleIncrement = () => {
    const value: number = parseFloat(defaultValue) + 1;
    if (max && value <= max && inputRef && inputRef.current) {
      onChange(value);
      inputRef.current.value = value;
    }
  };

  const handleDecrement = () => {
    const value: number = parseFloat(defaultValue) - 1;
    if (min === 0 || min) {
      if (min <= value && inputRef && inputRef.current) {
        onChange(value);
        inputRef.current.value = value;
      }
    }
  };

  return (
    <div className={metric === "" ? classes.wrapper + " " + classes.no_metric : classes.wrapper}>
      <input
        id={"number-input-" + name}
        data-cy={"Input " + name}
        ref={inputRef}
        type="number"
        className={classes.number_input + " " + classes[width]}
        min={min}
        max={max}
        defaultValue={defaultValue}
        onBlur={handleLeaveInput}
        disabled={disabled}
        aria-label={name}
      />
      <div className={classes.button_container}>
        <button
          className={classes.incrementer}
          disabled={disabled}
          onClick={handleIncrement}
          id={name ? "test-increment-" + name : ""}
          data-cy={"Increment " + name}
          aria-label={"Increment " + name}
        >
          <ExpandLess className={classes.icon} />
        </button>
        <button
          className={classes.decrementer}
          disabled={disabled}
          onClick={handleDecrement}
          id={name ? "test-decrement-" + name : ""}
          data-cy={"Decrement " + name}
          aria-label={"Decrement " + name}
        >
          <ExpandMore className={classes.icon} />
        </button>
      </div>
      <div className={classes.metric + " " + classes[width]}>{metric}</div>
    </div>
  );
};
