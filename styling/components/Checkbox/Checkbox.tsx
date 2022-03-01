import React from "react";
import classes from "./Checkbox.module.scss";
import { Checkbox as MuiCheckbox } from "@material-ui/core";

export type CheckboxProps = {
  onChange: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined;
  checked: boolean;
  disabled?: boolean;
  value?: string;
  label?: string;
};

export const Checkbox = ({ onChange, checked, disabled, value, label }: CheckboxProps) => {
  const id = label ? label.replace(/ /g, "") : undefined;
  return (
    <div className={disabled ? classes.checkbox + " " + classes.disabled : classes.checkbox}>
      <MuiCheckbox
        {...(value && { value: value })}
        size="small"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        {...(id && { id })}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};
