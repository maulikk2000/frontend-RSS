import React from "react";
import { Slider as MuiSlider } from "@material-ui/core";

interface SliderProps {
  min?: number;
  max?: number;
  value: number;
  onChange: any;
  disabled?: boolean;
  step: number;
  inputRef: any;
}
// Included props as above for spreading operation on input properties

/** These are based on the width of their container and sit inline with the text.*/
export const Slider = React.forwardRef(({ min, max, value, onChange, disabled, step, inputRef }: SliderProps, ref) => {
  const handleSlider = (event: any, value: number | number[]) => {
    if (inputRef.current) {
      if (typeof value === "number") {
        inputRef.current.value = value;
      }
    }
    onChange(value);
  };

  return (
    <MuiSlider
      min={min}
      max={max}
      value={value}
      onChange={handleSlider}
      step={step}
      disabled={disabled}
      getAriaValueText={(value) => `${value}`}
      aria-labelledby="discrete-slider"
      valueLabelDisplay="auto"
      marks
    />
  );
});
