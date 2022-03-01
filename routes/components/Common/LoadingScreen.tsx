import React, { FC } from "react";
import classes from "./LoadingScreen.module.scss";
import { LoadingSpinner } from "styling/components/LoadingSpinner/LoadingSpinner";

export const LoadingScreen: FC = () => {
  return (
    <div className={classes.wrapper}>
      <LoadingSpinner />
    </div>
  );
};
