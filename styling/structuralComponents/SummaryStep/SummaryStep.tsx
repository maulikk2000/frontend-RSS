import React, { CSSProperties, PropsWithChildren } from "react";
import classes from "./SummaryStep.module.scss";
import { Edit } from "@material-ui/icons";

type SummaryStepProps = {
  title: string;
  edit: Function;
  step: string | number;
  cssStyle?: CSSProperties;
};
export const SummaryStep = ({ title, edit, step, children, cssStyle }: PropsWithChildren<SummaryStepProps>) => {
  return (
    <div className={classes.summary_step} style={cssStyle}>
      <div className={classes.step_title} onClick={() => edit()}>
        <span className={classes.step_number}>{step}</span>
        {title}
        <span>
          <Edit />
        </span>
      </div>
      <div className={classes.step_content}>{children}</div>
    </div>
  );
};
