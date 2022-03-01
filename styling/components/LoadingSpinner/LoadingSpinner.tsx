import React, { FC } from "react";
import classes from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  size?: "small" | "standard";
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = "standard" }) => {
  return <div className={`${classes.spinner} ${size === "small" ? classes.small : ""}`}></div>;
};
