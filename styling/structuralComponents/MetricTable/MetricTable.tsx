import React from "react";
import classes from "./MetricTable.module.scss";

export type MetricTableProps = {
  clickable?: boolean;
  hasTotal?: boolean;
  children: React.ReactNode;
};

/** This table is used in the Right Sidebar in the Explore tab after a building has been solved.
- This has no background, and the rendering of this table depends on the amount of columns and the width of the parent element.
- This works the same way as a natural HTML table, ensure the head element of the child is <tbody></tbody>*/

export const MetricTable = ({ clickable, hasTotal, children }: MetricTableProps) => {
  return (
    <table
      className={
        clickable
          ? hasTotal
            ? classes.metric_table + " " + classes.clickable + " " + classes.has_total
            : classes.metric_table + " " + classes.clickable
          : classes.metric_table
      }
    >
      {children}
    </table>
  );
};
