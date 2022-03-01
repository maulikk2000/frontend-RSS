import React from "react";
import classes from "./LoaderIcons.module.scss";

export const LoaderIcons = () => {
  return (
    <div className={classes.spinner}>
      <div className={classes.bounce1}></div>
      <div className={classes.bounce2}></div>
      <div className={classes.bounce3}></div>
      <div className={classes.bounce4}></div>
      <div className={classes.bounce5}></div>
      <div className={classes.bounce6}></div>
    </div>
  );
};
