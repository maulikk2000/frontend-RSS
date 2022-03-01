import React from "react";
import classes from "./SummaryTable.module.scss";

export type RowsItem = {
  row: Array<string | number>;
  params?: "bold";
};

type SummaryTableProps = {
  headers: Array<string> | null;
  rows: Array<RowsItem> | null;

  /** String that matches the data of a row under a certain column */
  selectedItem?: string;

  /** Index of column where a row item equals the highlight data */
  columnIndex?: number;
};

/** This table is used in configurator in the Product Summary tab after a building has been solved.
 *  This has no background, and the rendering of this table depends on
 *  the amount of columns and the width of the parent element.*/

export const SummaryTable = ({ headers, rows, selectedItem, columnIndex }: SummaryTableProps) => {
  return (
    <table className={classes.summary_table}>
      <thead>
        {headers && (
          <tr>
            {headers.map((header: string, index) => (
              <th key={index}>
                <div>{header}</div>
              </th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {rows &&
          rows.map((row: RowsItem, index) => (
            <tr key={index}>
              {row.row.map((data: string | number, index) => (
                <td className={row.params ? classes[row.params] : ""} key={index}>
                  <div>{data}</div>
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};
