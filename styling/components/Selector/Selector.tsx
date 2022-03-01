import React, { ChangeEvent } from "react";
import classes from "./Selector.module.scss";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

interface SelectorProps {
  name: string;
  options?: Array<string>;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Selector = ({ name, options, disabled, onChange }: SelectorProps) => {
  /**
- This is built off Material UI's Selector
- Drop down menus should be as wide as their text container for affordance.
- Drop down container sizes have similar rules to text fields.
- Drop downs and drop down menus
*/
  const [state, setState] = React.useState(name);
  const handleChange = (event) => {
    setState(event.target.value);
    onChange(event);
  };

  return (
    <FormControl className={classes.form_control}>
      <div className={classes.select_wrapper}>
        <Select
          value={state}
          variant="outlined"
          className={classes.select_input}
          inputProps={{ "aria-label": "Without label" }}
          disabled={disabled}
          onChange={handleChange}
        >
          <MenuItem className={"menu_item"} value={name}>
            <em>{name}</em>
          </MenuItem>
          {options &&
            options.map((option, index) => (
              <MenuItem className={"menu_item"} value={option} key={index}>
                {option}
              </MenuItem>
            ))}
        </Select>
        <ExpandMore className={classes.icon} />
      </div>
    </FormControl>
  );
};
