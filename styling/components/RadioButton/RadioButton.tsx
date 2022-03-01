import React from "react";
import classes from "./RadioButton.module.scss";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

export type RadioButtonProps = {
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined;
  checked?: boolean;
  label: string | React.ReactNode;
  value: string | number;
  disabled?: boolean;
  classType?: "sub_option";
};

/**
- Should be wrapped in a Material UI RadioGroup if there are multiple to choose from 
- Radio buttons are to be used when only one item can be selected from a list.
- They should be used instead of checkboxes if only one item can be selected from a list. 
- If available options can be collapsed, consider using a dropdown menu instead, as it uses less space.
**/

export const RadioButton = ({ onChange, checked, value, label, classType, disabled }: RadioButtonProps) => {
  return (
    <div className={disabled ? classes.radio_button + " " + classes.disabled : classes.radio_button}>
      <FormControlLabel
        disabled={disabled}
        className={classType ? classes.radio_button + " " + classes[classType] : classes.radio_button}
        value={value}
        control={
          <Radio
            data-test={value}
            className={classes.radio_item}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            value={value}
          />
        }
        label={label}
      />
    </div>
  );
};
