import { ReactNode } from "react";
import classes from "./SummaryItem.module.scss";

type SummaryItemProps = {
  name: string;
  value: string | number | ReactNode;
  metric?: string;
  tooltip?: string;
};

/** Summary Items are predominately used inside Configurator Page and are used for displaying metrics and items that are selected by a user. These are based on the width of their container. */
export const SummaryItem = ({ name, value, metric, tooltip }: SummaryItemProps) => {
  return (
    <div className={classes.summary_item} data-title={tooltip}>
      <div className={classes.summary_name}>{name}</div>
      <div className={classes.summary_value}>
        {value}
        {metric}
      </div>
    </div>
  );
};
