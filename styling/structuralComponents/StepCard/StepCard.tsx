import React, { PropsWithChildren } from "react";
import { Check } from "@material-ui/icons";
import { ToolTip } from "styling/components";
import classes from "./StepCard.module.scss";

type StepCardProps = {
  completed?: boolean;
  step?: number;
  title?: string;
  description?: string;
  tooltip?: string;
  style?: any;
  reference?: any;
};
export const StepCard = ({
  completed,
  step,
  title,
  description,
  tooltip,
  children,
  style,
  reference
}: PropsWithChildren<StepCardProps>) => {
  return (
    <div className={classes.step_card} ref={reference} style={style ? style : {}}>
      {step && (
        <div className={completed ? classes.step_icon_completed : classes.step_icon}>
          {completed ? <Check className={classes.svg} /> : step}
        </div>
      )}
      <div className={classes.step_content}>
        {title && (
          <h4>
            {title}
            {tooltip && <ToolTip>{tooltip}</ToolTip>}
          </h4>
        )}
        {description ? <h5>{description}</h5> : null}
        {children}
      </div>
    </div>
  );
};
