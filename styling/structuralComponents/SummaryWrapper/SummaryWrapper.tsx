import React, { PropsWithChildren } from "react";
import classes from "./SummaryWrapper.module.scss";
import { Button } from "styling/components";

type SummaryWrapperProps = {
  title: string;
  subheader: string;
  buttonClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
};
export const SummaryWrapper = ({ title, subheader, buttonClick, children }: PropsWithChildren<SummaryWrapperProps>) => {
  return (
    <>
      <h1>{title}</h1>
      <div className={classes.subheader}>{subheader}</div>
      <div className={classes.flexExpand}>
        <div className={classes.summary_stepper}>{children}</div>
      </div>
      <Button classType="primary" onClick={buttonClick}>
        Edit
      </Button>
    </>
  );
};
