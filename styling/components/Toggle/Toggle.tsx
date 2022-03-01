import React from "react";
import classes from "./Toggle.module.scss";
import { fade, Switch, withStyles } from "@material-ui/core";
import variables from "styling/variables.module.scss";

/* Toggle Component */
type ToggleProps = {
  toggle: boolean;
  title: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  disabled?: boolean;
  note?: string;
};

/**
- Selection controls allow users to complete tasks that involve making choices such as selecting options, or switching settings on or off. 
- Selection controls are found on screens that ask users to make decisions or declare preferences such as settings or dialogs and immediately activate or deactivate something.
- Based on the width of the wrapping container.
 */
export const Toggle = ({ toggle, title, onChange, disabled, note }: ToggleProps) => {
  return (
    <>
      <div className={disabled ? classes.toggle_form + " " + classes._disabled : classes.toggle_form}>
        <div className={toggle ? classes.toggle_left : classes.toggle_left_inactive}>{title}</div>
        <div className={classes.toggle_right} data-title={note}>
          <PodiumTealSwitch disabled={disabled ? true : false} checked={toggle} onChange={onChange} />
        </div>
      </div>
    </>
  );
};

const PodiumTealSwitch = withStyles({
  switchBase: {
    color: "white",
    padding: 4,
    margin: 4,
    "&$checked": {
      color: variables.EliPodiumDarkTeal,
      "&:hover": {
        backgroundColor: fade(variables.EliPodiumDarkTeal, 0.05)
      }
    },
    "&$checked + $track": {
      backgroundColor: variables.EliSemiLightBlue
    }
  },
  checked: {},
  track: {
    backgroundColor: variables.EliUtilityDark
  }
})(Switch);
