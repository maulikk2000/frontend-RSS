import React, { useState } from "react";
import classes from "./TextField.module.scss";

interface TextFieldProps {
  onChange?: (e) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  id?: any;
  className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  onChange,
  onFocus,
  onBlur,
  value,
  label,
  multiline = false,
  rows = 8,
  id,
  className
}) => {
  const [classList, setClassList] = useState([classes.textField]);

  const getClasses = () => {
    if (label) {
      classList.push(classes.hasLabel);
    }
    return classList.join(" ");
  };

  const showLabel = () => {
    let newList = [...classList, classes.focus];
    setClassList(newList);
    if (onFocus) {
      onFocus();
    }
  };

  const hideLabel = () => {
    //TODO: Make this dynamic
    let newList = [classes.textField];
    setClassList(newList);
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className={getClasses()}>
      {label && (
        <label className={classes.label} htmlFor={id}>
          <span>{label}</span>
        </label>
      )}

      {multiline !== true && (
        <input
          id={id ? id : ""}
          className={`${classes.special} ${className ? className : undefined}`}
          type="text"
          {...(onChange && { onChange: onChange })}
          onFocus={showLabel}
          onBlur={hideLabel}
          value={value || ""}
        />
      )}

      {multiline === true && (
        <textarea
          className={classes.special}
          {...(rows && { rows: rows })}
          {...(onChange && { onChange: onChange })}
          onFocus={showLabel}
          onBlur={hideLabel}
          value={value || ""}
        />
      )}
    </div>
  );
};
