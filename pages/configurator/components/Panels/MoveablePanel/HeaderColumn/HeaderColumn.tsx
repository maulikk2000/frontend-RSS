import React from "react";
import classes from "./HeaderColumn.module.scss";

type Props = {
  title: string;
  description: string;
  isDocked: boolean;
};
export const HeaderColumn = ({ title, description, isDocked }: Props) => {
  const style = `${classes.headerColumn} ${isDocked ? classes.docked : ""}`;
  return (
    <div className={style}>
      <div className={classes.headerContent}>
        <h2>{title}</h2>
        {!isDocked && <h4>{description}</h4>}
      </div>
    </div>
  );
};
