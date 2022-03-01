import React from "react";
import { TextField } from "styling/components/TextField/TextField";

interface Props {
  editable?: boolean;
  value?: string;
  handleChange?: (e) => void;
  id?: string;
  variant?;
  autoFocus?: boolean;
  label?: string;
  type?: string;
  required?: boolean;
  rows?: number;
  multiline?: boolean;
  fullWidth?: boolean;
  className?: string;
  margin?: string;
  onTextboxSelected?: () => void;
}

const TextFieldLabel = (props: Props) => {
  return !props.editable ? (
    <span id={props.id ? props.id : ""}>{props.value}</span>
  ) : (
    <TextField
      id={props.id ? props.id : ""}
      {...(props.value && { value: props.value })}
      {...(props.label && { label: props.label })}
      {...(props.multiline && { multiline: props.multiline })}
      onChange={props.handleChange}
      onFocus={props.onTextboxSelected}
    ></TextField>
  );
};

export default TextFieldLabel;
