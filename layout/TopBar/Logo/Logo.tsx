import React from "react";
import { ReactComponent as EliLogo } from "../../../styling/assets/icons/podium_logo.svg";
import classes from "./Logo.module.scss";

const Logo = () => {
  return (
    <div className={classes.logo}>
      <EliLogo />
    </div>
  );
};

export default Logo;
